import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {PostLayoutOption} from '../models/post-layout-option';
import {PostLayoutInput} from '../models/post-layout-input';
import {lastValueFrom} from 'rxjs';

@Injectable()
export class UserService {

  private readonly resourceUrl = `${environment.apiHost}/api/v1/post-layout`;

  constructor(private httpClient: HttpClient) {
  }

  public calculateOptions(input: PostLayoutInput): Promise<PostLayoutOption[]> {
    return lastValueFrom(
      this.httpClient
        .post<PostLayoutOption[]>(this.resourceUrl, input)
    );
  }
}
