import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChange,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import * as THREE from 'three';
import {Color, Object3D} from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {ObstructionData, ObstructionType} from '../../models/post-layout-input';
import {environment} from '../../../environments/environment';
import {PostLayoutOption} from '../../models/post-layout-option';

const obstructionColor: { [key in ObstructionType]: Color } = {
  [ObstructionType.PLACE_POST]: new Color('#80ff00'),
  [ObstructionType.TRY_TO_AVOID]: new Color('#ff8000'),
  [ObstructionType.MUST_AVOID]: new Color('#990000')
}

@Component({
  selector: 'app-layout-view',
  templateUrl: './layout-view.component.html',
  styleUrls: ['./layout-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutViewComponent implements OnInit, OnChanges {

  private engine: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private cameraControls: OrbitControls;
  private root: Object3D;

  @Input() postLayout: PostLayoutOption;
  @Input() postSize: number;
  @Input() obstructions: ObstructionData[];

  @ViewChild('canvasContainer', {static: true})
  private canvasContainer: ElementRef;

  ngOnInit(): void {
    this.init();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.postLayout) {
      this.onPostLayoutChange(changes.postLayout);
    }
  }

  private onPostLayoutChange(change: SimpleChange): void {
    if (change && !change.isFirstChange()) {
      this.disposeScene();
      this.assemble();
    }
  }

  private disposeScene(): void {
    this.root.children.forEach((child: any) => {
      child.traverse((object: any) => {
        if (object.isMesh) {
          if (object.geometry) {
            object.geometry.dispose();
          }

          if (Array.isArray(object.material)) {
            (object.material as THREE.Material[]).forEach(material => material.dispose());
          } else {
            (object.material as THREE.Material).dispose();
          }
        }
      });

      child.parent.remove(child);
    });

    this.root.remove(...this.root.children);
  }

  get canvasElm(): HTMLElement {
    return this.canvasContainer.nativeElement;
  }

  private init(): void {
    this.root = new Object3D();
    this.scene = new THREE.Scene();
    this.scene.add(this.root);
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    this.engine = new THREE.WebGLRenderer();
    this.engine.setSize(this.canvasElm.clientWidth, this.canvasElm.clientHeight);
    this.engine.localClippingEnabled = true;
    this.engine.shadowMap.enabled = false;
    this.engine.setClearColor(0xffffff);

    this.canvasElm.appendChild(this.engine.domElement);

    this.initCamera();
    this.initCameraControls();

    if (!environment.production) {
      this.scene.add(new THREE.AxesHelper(500));
      this.scene.add(new THREE.CameraHelper(this.camera));
    }

    this.assemble();

    this.initLight();
    this.addGround();

    this.run();
  }

  private assemble(): void {
    this.postLayout?.postLocations.forEach((location, i) => this.addPost(location, this.postSize, i));
    this.obstructions?.forEach((obstruction, i) => this.addObstruction(obstruction.location, obstruction.size, obstruction.type, i))
  }

  private initLight(): void {
    const light = new THREE.PointLight('#ffffff', 1);
    this.camera.add(light);
    light.position.set(0, 100, 900);
  }

  private addGround(): void {
    const geometry = new THREE.PlaneGeometry(10000, 500);
    const material = new THREE.MeshBasicMaterial({color: '#78b464', side: THREE.DoubleSide});
    const plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = Math.PI / 2;

    this.scene.add(plane);
  }

  private addPost(position: number, size: number, index: number): void {
    const geometry = new THREE.BoxGeometry(size, 48, size, 100, 100, 100);
    const material = new THREE.MeshPhongMaterial({color: '#59473d'});
    const post = new THREE.Mesh(geometry, material);

    post.position.x = position;
    post.position.y = 24;
    post.name = `post-${index + 1}`;
    this.root.add(post);
  }

  private addObstruction(position: number, size: number, type: ObstructionType, index: number): void {
    const geometry = new THREE.CylinderGeometry(size / 2, size / 2, 1, 100, 100);
    const material = new THREE.MeshPhongMaterial({color: obstructionColor[type]});
    const obstruction = new THREE.Mesh(geometry, material);

    obstruction.position.x = position;
    obstruction.position.y = 0.5;
    obstruction.name = `obstruction-${index + 1}`
    this.root.add(obstruction);
  }

  private initCamera(): void {
    const canvas = this.engine.domElement;
    const camera = new THREE.PerspectiveCamera(60, canvas.width / canvas.height, 5, 20000);

    this.scene.add(camera);
    this.camera = camera;
  }

  private initCameraControls(): void {
    this.cameraControls = new OrbitControls(this.camera, this.engine.domElement);

    const position = new THREE.Vector3(50, 50, 500);
    const lookAt = new THREE.Vector3(50, 24, 0);
    this.cameraControls.object.position.copy(position);
    this.cameraControls.target.copy(lookAt);
    this.cameraControls.update();
  }

  protected run(): void {
    const render = () => {
      this.engine.render(this.scene, this.camera);
      window.requestAnimationFrame(render)
    };
    render();
  }
}
