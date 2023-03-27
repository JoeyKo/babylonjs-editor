import instance from "@/utils/axios";

class FileAPI {
  /**
   * 上传文件
   */
  static uploadFiles(data: any, onUploadProgress?: ((progressEvent: any) => void)): Promise<any> {
    return instance.post('/v1/file/upload/', data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress
    })
  }
}

export default FileAPI;