#!/usr/bin/env node
const program = require('commander');
const targz = require('tar.gz');
const fetch = require('node-fetch');

// CLI info
program
  .version('1.2.0')
  .description('CLI Modules')


// Adding module
program
  .command('add <module>')
  .alias('a')
  .description('Add a module')
  .action((module) => {
    var compress = new targz().compress(__dirname, './' + module + '.tar.gz',
      function (err) {
        if (err)
          console.err(err);
        const file = '@' + __dirname + '/' + module + '.tar.gz';
        const { exec } = require('child_process');
        exec(`curl -X POST -H "Content-Type: multipart/form-data"  -v -F 'universe=${file}'  http://localhost:3000/api/v1/module`, (err, stdout, stderr) => {
          if (err) {
            console.error(err);
            return;
          }
          console.log(`stdout: ${stdout}`);
          console.log(`stderr: ${stderr}`);
        });
      });
  });

// module list
program
  .command('list')
  .alias('l')
  .description('List all modules')
  .action(() => fetch('http://localhost:3000/api/v1/modules')
    .then(res => res.json())
    .then(json => console.log(json))
  )

// delete module
program
  .command('delete <originalname>')
  .alias('d')
  .description('Remove a module')
  .action(originalname => {
    fetch('http://localhost:3000/api/v1/modules/' + originalname, {
      method: 'DELETE',
    })
  })

program.parse(process.argv);
