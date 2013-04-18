var fs = require('fs');
var path = require('path');
var jshint = require('jshint').JSHINT;
var byline = require('byline');
var colors = require('colors');
var packageDetails = require('./package.json');


// Regular expressions borrowed from JSHint.
function stripComments(str) {
	return str ? str.replace(/\/\*(?:(?!\*\/)[\s\S])*\*\//g, '').replace(/\/\/[^\n\r]*/g, '') : '';
}

// Make a string of num spaces.
function pad(num) {
	return (new Array(num + 1)).join(' ');
}

// Pretty format errors from JSHint.
function formatErrors(fileName, data) {
	console.error(('Errors in file: ' + fileName).red);

	var lineWidth = 0;
	var charWidth = 0;

	// Work out uniform paddings to align columns.
	data.forEach(function (error) {
		lineWidth = Math.max(('' + error.line).length, lineWidth);
		charWidth = Math.max(('' + error.character).length, charWidth);
	});

	data.forEach(function (error) {
		var thislineWidth = ('' + error.line).length;
		var linePadding = lineWidth - thislineWidth;

		var thisCharWidth = ('' + error.character).length;
		var charPadding = charWidth - thisCharWidth;

		console.error('  line', (error.line + pad(linePadding)).green, 'char', (error.character + pad(charPadding)).green + ':', error.reason.red.bold);
	});
}


// Tell the user what this is.
console.log(('multijshint - version ' + packageDetails.version).bold.blue);

var problems = 0;
var files = 0;
var cfg;


// Try to load the config file.
try {
	cfg = JSON.parse(stripComments(fs.readFileSync('./jshint.cfg').toString('utf8')));
} catch (e) {
	console.error('Could not parse config file.');
	process.exit(1);
}


// Create the line consumer.
var feed = byline(process.stdin);

// Lines are expected to be paths to files for JSHint to process.
feed.on('data', function (fileName) {
	if (!fileName) {
		return;
	}

	files += 1;

	var content = fs.readFileSync(fileName).toString('utf8');
	var success = jshint(content, cfg);

	if (!success) {
		problems += 1;
		formatErrors(fileName, jshint.errors);
	}
});

// At the end of the list of files, count up the problems
feed.on('end', function () {
	if (problems) {
		console.error((problems + ' of ' + files + ' files failed.').bold.red);
	} else {
		console.log(('Processed ' + files + ' files with no failures.').bold.green);
	}

	// The exit code is the number of files that failed.
	process.exit(problems);
});
