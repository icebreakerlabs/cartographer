import { spawn } from "child_process";
import { attestationSchemas } from './attestationSchemas';
import { type AttestationSchema } from './types';

const ICE_CREAM_PATTERN = /^(🍦|ice\s*cream|icecream)/i;

export async function getSchema(cleanText: string): Promise<AttestationSchema | undefined> {

  const skillNames ='[' + attestationSchemas
       .flatMap(({ name }) => name.startsWith('Skill:') ? name : [])
       .join(', ') + ']'
  try{
    const schemaName = await new Promise<AttestationSchema | undefined>((resolve, reject) => {
      const py = spawn("uv", ["run", "getSchema.py", cleanText, skillNames]);

      let output = '';
      let error = '';

      py.stdout.on("data", (data) => {
        output += data.toString();
      });

      py.stderr.on("data", (data) => {
        error += data.toString();
      });

      const schemaName = output.trim();
      const matchedSchema = attestationSchemas.find(
       ({ name }) => name.toLowerCase() === schemaName.toLowerCase()
      );

      py.on("close", (code) => {
        if (code === 0 && matchedSchema) {
          resolve(matchedSchema || undefined);
        } else {
          reject(new Error(error || `Python process exited with code ${code}`));
        }
      });
    });

    return schemaName;
  } catch {
  // Fallback logic if the Python subprocess fails
    return cleanText.startsWith('bot')
      ? attestationSchemas.find((schema) => schema.name === 'Feather Ice')
      : ICE_CREAM_PATTERN.test(cleanText)
      ? attestationSchemas.find((schema) => schema.name === 'Ice cream')
      : attestationSchemas.find((schema) =>
          cleanText.includes(schema.name.toLowerCase())
        );
  }

}
