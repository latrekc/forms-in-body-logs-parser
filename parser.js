#!/usr/bin/env node
var fs = require('fs');

function error(msg) {
    console.error(msg)
    process.exit();
}


if(process.argv.length < 3) {
    error('Give me path to log file');
}

var input = process.argv[2];

if(!fs.existsSync(input)) {
    error('File ' + input + ' doesn\'t exists');
}

var output = input.replace(/\.log$/, '').concat('.txt');
var encoding = 'ascii';


if(fs.existsSync(output)) {
    var stat = fs.statSync(output);

    if(!stat.isFile()) {
        error(input + ' must be a file');
    }
}

// clear output file
var fd = fs.openSync(output, 'w');
fs.truncateSync(fd, 0);

fs.readFile(input, encoding, function(err, data) {
    data.split("\n").forEach(function(line) {
        var match = line.match(/\[(\d+) (\d{2}\.\d{2}\.\d{4} \d{2}:\d{2}:\d{2})\] I <([^>]+)> FORMS_IN_BODY\.([^ ]+) \[([^\]]+)\]/);

        if(!match) {
            return;
        }

        match = match.slice(1);

        var id      = match.shift();
        var date    = match.shift();
        var octopus = match.shift();
        var message = decodeURIComponent(match.shift().replace(/(&|^)\d+=/g, '').replace(/\+/g, ' '));
        var ua      = match.shift();

        fs.appendFileSync(output, [id, date, message, ua].join("\t").concat("\n\n"), encoding);
    })

    console.log('Done. Result writed to ' + output);
})
