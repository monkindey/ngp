#!/usr/bin/env node

'use strict';

const cp = require('child_process');
const ngp = require('../index.js');
ngp().then(res => console.log(res));
