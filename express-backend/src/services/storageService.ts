import { BlobServiceClient } from '@azure/storage-blob';

const sasUrl = 'https://bbdaihackathon.blob.core.windows.net/ai-hackathon?sp=racwl&st=2025-08-23T22:25:59Z&se=2025-12-31T06:40:59Z&sv=2024-11-04&sr=c&sig=NBlfelPfiNwYeIMHAs5%2Bl%2B9cuGtuvuDhnJihOR9oANo%3D';
const containerName = 'ai-hackathon';

export const uploadToBlob = async (fileBuffer: Buffer, fileName: string): Promise<string> => {
  try {
    const blobServiceClient = new BlobServiceClient(sasUrl);
    const containerClient = blobServiceClient.getContainerClient(containerName);
    
    const blobName = `${Date.now()}-${fileName}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    
    await blockBlobClient.upload(fileBuffer, fileBuffer.length);
    
    return `https://bbdaihackathon.blob.core.windows.net/${containerName}/${blobName}`;
  } catch (error) {
    console.error('Blob upload error:', error);
    throw error;
  }
};