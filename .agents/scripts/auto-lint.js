const { execSync } = require('child_process');

try {
  console.error("Executando linting e type checking (Auto-Cura)...");
  
  // Executa o linter
  execSync('npm run lint', { stdio: 'pipe' });
  
  // Executa checagem de tipos (opcional, pode falhar se não houver tsconfig válido no momento, ignora se necessário)
  try {
    execSync('npx tsc --noEmit', { stdio: 'pipe' });
  } catch (e) {
    // Falha no tsc
    console.log(JSON.stringify({ decision: 'continue', message: 'tsc failed, continuing' }));
    process.exit(0);
  }
  
  // Sucesso em ambos
  console.log(JSON.stringify({ decision: 'allow' }));
} catch (error) {
  // Linter falhou, obriga a IA a continuar trabalhando
  console.log(JSON.stringify({ decision: 'continue', message: 'Linting errors found. Please fix them.' }));
}
