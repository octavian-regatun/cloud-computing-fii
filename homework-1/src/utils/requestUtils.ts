import { IncomingMessage } from 'http';

export const getRequestBody = (req: IncomingMessage): Promise<any> => {
  return new Promise((resolve, reject) => {
    const bodyParts: Buffer[] = [];
    
    req.on('data', (chunk) => {
      bodyParts.push(chunk);
    });
    
    req.on('end', () => {
      try {
        const body = Buffer.concat(bodyParts).toString();
        
        if (!body) {
          resolve({});
          return;
        }
        
        const parsedBody = JSON.parse(body);
        resolve(parsedBody);
      } catch (error) {
        reject(new Error('Invalid JSON in request body'));
      }
    });
    
    req.on('error', (error) => {
      reject(error);
    });
  });
}; 