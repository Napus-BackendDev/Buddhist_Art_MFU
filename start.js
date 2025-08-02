#!/usr/bin/env node
import inquirer from 'inquirer';
import { exec } from 'child_process';

console.log('✨ Buddhist Start ✨\n');

const main = async () => {
  const { choice } = await inquirer.prompt([
    {
      type: 'list',
      name: 'choice',
      message: 'คุณต้องการรันอะไร?',
      choices: ['Frontend (Vue)', 'Backend (NestJS)']
    }
  ]);

  const command = choice.startsWith('Frontend')
    ? 'npm run dev:frontend'
    : 'npm run dev:backend';

  const child = exec(command);
  child.stdout.pipe(process.stdout);
  child.stderr.pipe(process.stderr);
};

main();
