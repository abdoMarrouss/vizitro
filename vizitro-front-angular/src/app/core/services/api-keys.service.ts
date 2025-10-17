import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiKey, ApiResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ApiKeysService {
  private apiUrl = environment.apiUrl;
  apiKeys = signal<ApiKey[]>([]);
  selectedApiKey = signal<ApiKey | null>(null);

  constructor(private http: HttpClient) {
    this.loadSelectedFromStorage();
  }

  loadApiKeys() {
    return this.http.get<ApiResponse<ApiKey[]>>(`${this.apiUrl}/keys`)
      .pipe(tap(response => {
        this.apiKeys.set(response.data);
        if (response.data.length > 0 && !this.selectedApiKey()) {
          this.selectedApiKey.set(response.data[0]);
        }
      }));
  }

  createApiKey(data: { name: string; websiteUrl?: string }) {
    return this.http.post<ApiResponse<ApiKey>>(`${this.apiUrl}/keys`, data)
      .pipe(tap(response => {
        this.apiKeys.update(keys => [...keys, response.data]);
        this.selectedApiKey.set(response.data);
      }));
  }

  deleteApiKey(id: string) {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/keys/${id}`)
      .pipe(tap(() => {
        this.apiKeys.update(keys => keys.filter(k => k.id !== id));
        if (this.selectedApiKey()?.id === id) {
          this.selectedApiKey.set(this.apiKeys()[0] || null);
        }
      }));
  }

  selectApiKey(key: ApiKey) {
    this.selectedApiKey.set(key);
    localStorage.setItem('selectedApiKey', JSON.stringify(key));
  }

  private loadSelectedFromStorage() {
    const saved = localStorage.getItem('selectedApiKey');
    if (saved) {
      this.selectedApiKey.set(JSON.parse(saved));
    }
  }
}