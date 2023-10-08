import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as THREE from 'three';
import {Color} from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {ObstructionType} from '../../models/post-layout-input';

const obstructionColor: { [key in ObstructionType]: Color } = {
  [ObstructionType.PLACE_POST]: new Color('#80ff00'),
  [ObstructionType.TRY_TO_AVOID]: new Color('#ff8000'),
  [ObstructionType.MUST_AVOID]: new Color('#990000')
}

@Component({
  selector: 'app-layout-view',
  templateUrl: './layout-view.component.html',
  styleUrls: ['./layout-view.component.scss']
})
export class LayoutViewComponent implements OnInit {

  private engine: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private cameraControls: OrbitControls;

  @ViewChild('canvasContainer', {static: true})
  private canvasContainer: ElementRef;

  ngOnInit(): void {
    this.init();
  }

  get canvasElm(): HTMLElement {
    return this.canvasContainer.nativeElement;
  }

  private init(): void {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    this.engine = new THREE.WebGLRenderer();
    this.engine.setSize(this.canvasElm.clientWidth, this.canvasElm.clientHeight);
    this.engine.localClippingEnabled = true;
    this.engine.shadowMap.enabled = false;
    this.engine.setClearColor(0xffffff);

    this.canvasElm.appendChild(this.engine.domElement);

    this.initCamera();
    this.initCameraControls();
    this.scene.add(new THREE.AxesHelper(500));
    this.scene.add(new THREE.CameraHelper(this.camera));

    this.addPost(0);
    this.addPost(20);
    this.addObstruction(3, 3, ObstructionType.PLACE_POST);
    this.addObstruction(6, 3, ObstructionType.TRY_TO_AVOID);
    this.addObstruction(9, 3, ObstructionType.MUST_AVOID);

    this.initLight();
    this.addGround();

    this.run();
  }

  private initLight(): void {
    const light = new THREE.PointLight('#ffffff', 1);
    this.camera.add(light);
    light.position.set(0, 100, 900);
  }

  private addGround(): void {
    const geometry = new THREE.PlaneGeometry(1000, 1000);
    const material = new THREE.MeshBasicMaterial({color: '#78b464', side: THREE.DoubleSide});
    const plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = Math.PI / 2;

    this.scene.add(plane);
  }

  private addPost(position: number): void {
    const geometry = new THREE.BoxGeometry(3.5, 48, 3.5, 100, 100, 100);
    const material = new THREE.MeshPhongMaterial({color: '#59473d'});
    const post = new THREE.Mesh(geometry, material);

    post.position.x = position;
    post.position.y = 24;
    this.scene.add(post);
  }

  private addObstruction(position: number, size: number, type: ObstructionType): void {
    const geometry = new THREE.CylinderGeometry(size, size, 1, 100, 100);
    const material = new THREE.MeshPhongMaterial({color: obstructionColor[type]});
    const obstruction = new THREE.Mesh(geometry, material);

    obstruction.position.x = position;
    obstruction.position.y = 0.5;
    this.scene.add(obstruction);
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
