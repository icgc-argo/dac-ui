export const createDownloadInWindow = (filename: string, blobData: Blob) => {
  const downloadUrl = window.URL.createObjectURL(blobData);
  const link = document.createElement('a');
  link.style.display = 'none';
  link.href = downloadUrl;
  link.setAttribute('download', filename);
  // Comment from ARGO Platform UI: Safari thinks _blank anchor are pop ups. We only want to set _blank
  // target if the browser does not support the HTML5 download attribute.
  // This allows you to download files in desktop safari if pop up blocking
  // is enabled.
  if (typeof link.download === 'undefined') {
    link.setAttribute('target', '_blank');
  }
  document.body.appendChild(link);
  link.click();
  link.remove();
};
