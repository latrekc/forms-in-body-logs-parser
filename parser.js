#!/usr/bin/env node
require('fs').readFile('forms.log', 'ascii', function(err, data) {
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

        console.log(id, date, message, ua)
        console.log('\n')
    })
})