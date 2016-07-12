import assert from 'power-assert';
import Cloud from './../lib/cloud';

const AWS_ACCESS_KEY_ID = 'AKIAIEDX62WCR3SCSWWQ';
const AWS_SECRET_ACCESS_KEY = '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';
const AWS_REGION = 'ap-northeast-1';
const AWS_VPC_ID = 'vpc-ffb5bc9d';

describe('lib/cloud.js', () => {
  describe.skip('getVpcList', () => {
    it('return array of vpcs', (done) => {
      setTimeout(done, 10000);
      let aws = new Cloud(AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION);
      aws.getVpcList((err, res) => {
        if (err) {
          console.log(err);
          assert.ok(false);
          return done();
        }

        console.log(res);
        assert.ok(true);
        done();
      });
    });
  });

  describe('getSecurityGroupList', () => {
    it('return array of security group', (done) => {
      setTimeout(done, 10000);
      let aws = new Cloud(AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION);
      aws.getSecurityGroupList(AWS_VPC_ID, (err, res) => {
        if (err) {
          console.log(err);
          assert.ok(false);
          return done();
        }

        console.log(res);
        assert.ok(true);
        done();
      });
    });
  });
});
