import { exec } from 'child_process';
import { sep } from 'path';
const main = './dist/index.js'.replace(/\//g, sep);

const ORG_ID = process.env.TEST_ORG_ID as string;

describe('`snyk-licenses-report generate <...>`', () => {
  it('Shows error when missing --orgPublicId', async (done) => {
    exec(
      `node ${main} generate`,
      {
        env: {
          PATH: process.env.PATH,
          SNYK_TOKEN: process.env.SNYK_TEST_TOKEN,
        },
      },
      (err, stdout) => {
        expect(stdout).toBe('');
        expect(err.message.trim()).toMatchSnapshot();
        done();
      },
    );
  });

  it('generated the report successfully with default params', (done) => {
    exec(
      `node ${main} generate --orgPublicId=${ORG_ID}`,
      {
        env: {
          PATH: process.env.PATH,
          SNYK_TOKEN: process.env.SNYK_TEST_TOKEN,
        },
      },
      (err, stdout) => {
        expect(err).toBeNull();
        expect(stdout).toMatch('HTML license report saved at');
        done();
      },
    );
  }, 50000);

  it.skip('generated the report successfully as PDF', (done) => {
    exec(
      `node ${main} generate --orgPublicId=${ORG_ID} --outputFormat=pdf`,
      {
        env: {
          PATH: process.env.PATH,
          SNYK_TOKEN: process.env.SNYK_TEST_TOKEN,
        },
      },
      (err, stdout) => {
        expect(err).toBeNull();
        expect(stdout).toMatch('PDF license report saved at');
        done();
      },
    );
  }, 50000);
  it('generated the report successfully with custom template', (done) => {
    exec(
      `node ${main} generate --orgPublicId=${ORG_ID} --template=${__dirname +
        '/fixtures/custom-view.hbs'}`,
      {
        env: {
          PATH: process.env.PATH,
          SNYK_TOKEN: process.env.SNYK_TEST_TOKEN,
        },
      },
      (err, stdout) => {
        expect(err).toBeNull();
        expect(stdout).toMatch('HTML license report saved at');
        done();
      },
    );
  }, 50000);
  it.todo('API is down');
  it.todo('Requested org has no licenses policy');
});
