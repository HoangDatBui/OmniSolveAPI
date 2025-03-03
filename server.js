import express from 'express';
import bcrypt from 'bcrypt';
import cors from 'cors';
import knex from 'knex';

import { registerFunction } from './controllers/register.js';
import { signInFunction } from './controllers/signin.js';
import { profileFunction } from './controllers/profile.js';
import { limitationFunction, handleAPICall } from './controllers/limitation.js';

const PORT = process.env.PORT || 4000;
const saltRounds = 10;

// Read the SSL certificate
const ca = `
-----BEGIN CERTIFICATE-----
MIIETTCCArWgAwIBAgIUOiMvcCBWSXrq1vK2K4DT3dzK9qYwDQYJKoZIhvcNAQEM
BQAwQDE+MDwGA1UEAww1YWYzMGM3ZGItZTM1OS00ODU1LWJjYWMtOTRmODYwZmVm
Yzc4IEdFTiAxIFByb2plY3QgQ0EwHhcNMjUwMzAzMTIzNDM4WhcNMzUwMzAxMTIz
NDM4WjBAMT4wPAYDVQQDDDVhZjMwYzdkYi1lMzU5LTQ4NTUtYmNhYy05NGY4NjBm
ZWZjNzggR0VOIDEgUHJvamVjdCBDQTCCAaIwDQYJKoZIhvcNAQEBBQADggGPADCC
AYoCggGBANk6nG/TjtYNCcmoRNvqGj3gJFW5+C6OJFFmjlMlGk8/S3dksu2oWHTL
e+G0X8Nenc6JqJDQxqtag0FkIQsoX8nhX2ufcUNRdr3v22TNew5oBDEDLODEBYB7
HVc+wrgbQvSW0w5hV2MZIKriw3Z62E3QQkoVUP3MkqkFyldBCZu0PKhyMdbTpYX2
BpyxX1T5PeX8NI/kXxQGOa4BEaBS3A0LQJlSj1lgM4FyS54xIdz0hYXlNYzNdcFJ
R1YzdtSz7g2rkXizddNafe6DYW71fOOah+NVtVxqsOTYNFgRjKKQR8a6MFAfnHyR
1Zw/76npfsEmVx2vbyxzsMLEczOTwHLXrIBZJe9bCFzoYV9FTUnBFsg1YScUaNio
Sk+OoS1qmRHWR9zd99Tz6Z7h7HUhovrVs6vMzXsaoI1vRm3uGbgTuiKR/AnWyc6m
OPnQ6kAPWKjYSBYD6nbYma1be1UoCTxAVdbDN9r+k7UxyHkgBfTUCP1rsJhdZJGl
cTsgxBZnbwIDAQABoz8wPTAdBgNVHQ4EFgQUSFAGEq1fqJKVjqdtYiPE8M0dsFYw
DwYDVR0TBAgwBgEB/wIBADALBgNVHQ8EBAMCAQYwDQYJKoZIhvcNAQEMBQADggGB
AE79naSo8b2gSdDz4Xwx/WaTCC34xkAzvzb3Jc7Q2bWe16fV6gs2oDxztOCR6YeW
bJ52Ee7bREFDZmaL27UejAJkmoZyiofkiL2vMPEXjyEoi6X01b4qwviMzmxPv4MX
f5THUacALO66RHVz7piFaCWkmMIPqRgqsDe2j1sQtYlmdeBjP62UhOXbeekITTQd
hlAis39vVes1flT4BgotTssWGj/cUJI2Z95l22KMM+6Z9CYcmGWG6w79998P5Y3S
A9MjF0iuomQXYFG+9SKvLdXMG1Fb44Bseg3EyaNFp+tX0GbNB2tFROtxDEnzZbOJ
nA8ptjzIqhf4b6kx86WJOSkn3hwA8oqvzM1833ex9tsUhz3Rj01oTTqmRPChn31G
y2uGupyxfsdkcD45SkdF22qJB5sBDflY0DmjgzSc4sysar0er7//V2JcnHECJcRt
tzZz1pgizvrHxy8dZSUPO92qIJcQggEG/j3akWayBikIJs8B9cSSrzejtQ+MlBxv
NA==
-----END CERTIFICATE-----
`;

// Updated database configuration with SSL
const db = knex({
    client: 'pg',
    connection: {
        host: 'omnisolve-omnisolve.l.aivencloud.com',
        port: 27964,
        user: 'avnadmin',
        password: 'AVNS_7-8I_H9qF4Ghe92cbjF',
        database: 'defaultdb',
        ssl: {
            rejectUnauthorized: true,
            ca: ca
        }
    }
});

// Test database connection
db.raw('SELECT VERSION()')
    .then(version => {
        console.log('Database connected successfully');
        console.log('PostgreSQL version:', version.rows[0].version);
    })
    .catch(err => {
        console.error('Database connection failed:', err);
    });

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => { res.send("nothing here!") })

app.post('/signin', (req, res) => { signInFunction(req, res, db, bcrypt) })

app.post('/register', (req, res) => { registerFunction(req, res, db, bcrypt, saltRounds) })

app.get('/profile/:id', (req, res) => { profileFunction(req, res, db) })

app.put('/limitation', (req, res) => { limitationFunction(req, res, db) })

app.post('/facerec', (req, res) => { handleAPICall(req, res) })

app.listen(PORT, () => {
    console.log('Server is running on port', PORT);
});