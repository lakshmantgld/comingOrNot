var gulp = require('gulp'),
    isWin = /^win/.test(process.platform),
    commandSeparator = isWin ? '&' : ';',
    webpack = require('webpack'),
    exec = require('child_process').exec,
    gulpSequence = require('gulp-sequence');

function runCommand(cmd, done) {
    var ls = exec(cmd);
    ls.stdout.on('data', function(data) {
        console.log(data);
    });
    ls.stderr.on('data', function(data) {
        console.log(data);
    });
    ls.on('close', function(data) {
        done && done();
    });
}

/* Start dynamodb local instance */
gulp.task('start-dynamodb', function(done) {
    runCommand('cd serverless' + commandSeparator + ' sls dynamodb start', done);
});

/* Start offline server for local development */
gulp.task('start-offline-server', function(done) {
    runCommand('cd serverless ' + commandSeparator + 'serverless offline start', done);
});

/* Start offline server for local development */
gulp.task('start-client', function(done) {
    runCommand('cd reactJS ' + commandSeparator + 'node server.js', done);
});

/* Start offline server for local development */
gulp.task('open-website', function(done) {
    require("opn")("http://localhost:3000");
});

/* Deploy the local database tables to AWS dynamodb */
gulp.task('deploy-db', function() {
    runCommand('cd serverless' + commandSeparator + ' sls dynamodb executeAll');
});

/* Deploy Lambdas and API Gateway to AWS */
gulp.task('deploy-api', function() {
    runCommand('cd serverless' + commandSeparator + ' ../node_modules/serverless/bin/serverless deploy -v');
});

/* Deploy serverless service and dynamoDB in AWS */
gulp.task('deploy', gulpSequence(['deploy-api']));
// gulp.task('deploy', gulpSequence(['deploy-db', 'deploy-api']));

/* Bundle the reactJS and open the website */
gulp.task('default', gulpSequence(['start-client', 'open-website']));
// gulp.task('default', gulpSequence(['start-client', 'open-website', 'start-dynamodb', 'start-offline-server']));
