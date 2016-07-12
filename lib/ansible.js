import { exec } from 'child_process';

class Ansible {
  constructor(playbookPath, params) {
    this.playbook = {};
    this.playbook.fileName = playbookPath.split('/').pop();
    this.playbook.directory = playbookPath.replace(this.playbook.fileName, '');
    this.playbook.params = params;
  }

  setAwsAccount(accessKeyId, secretAccessKey, region) {
    this.aws = {};
    this.aws.accessKeyId = accessKeyId;
    this.aws.secretAccessKey = secretAccessKey;
    this.aws.region = region;
  }

  setKeyPair(keyPairName, keyPairPath) {
    this.keyPair = {};
    this.keyPair.name = keyPairName;
    this.keyPair.path = keyPairPath;
  }

  getArguments() {
    let args = '';
    if (this.keyPair && this.keyPair.name) {
      args += 'keypair=' + this.keyPair.name + ' ' +
        'ansible_ssh_private_key_file=' + this.keyPair.path + ' ';
    }
    for (let parameter in this.playbook.params) {
      if (this.playbook.params.hasOwnProperty(parameter) && parameter !== 'keypair') {
        args += parameter + '=' + this.playbook.params[parameter] + ' ';
      }
    }
    return args;
  }

  getOptions() {
    return {
      cwd: this.playbook.directory,
      env: {
        'AWS_ACCESS_KEY_ID': this.aws.accessKeyId,
        'AWS_SECRET_ACCESS_KEY': this.aws.secretAccessKey,
        'AWS_REGION': this.aws.region
      }
    };
  }

  exec(callback) {
    let cmd = 'ansible-playbook' + ' ' + this.playbook.fileName;
    let args = ' --extra-vars ' + '\"' + this.getArguments() + '\"';
    let options = this.getOptions();

    callback(exec(cmd + args, options));
  }
}

export default Ansible;
