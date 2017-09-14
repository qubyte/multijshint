# multijshint

[![Greenkeeper badge](https://badges.greenkeeper.io/qubyte/multijshint.svg)](https://greenkeeper.io/)

This is a simple utility that allows a single node instance to process a list of files through JSHint. This is useful for large projects that may need to test many files, and feel the lag from booting a node process for each.

Pipe this utility a list of file paths and it will do the rest. For example, with a global installation:

```bash
ls ../path/to/files/*.js | multijshint
```

For a local install, in your `package.json` scripts field a similar line can be placed (although you should do something better to make a list of your files, say for the git pre-commit hook):

```json
{
    "scripts": {
        "multijshint": "ls ./lib/*.js | multijshint"
    }
}
```

When testing files, those with errors will have some information pretty printed so that you can easily find and correct the error. The exit status of this utility is equal to the number of files that failed.

## TODO

Handle flags so that a config file can be indicated.