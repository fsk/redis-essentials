import dotenv from 'dotenv';
import express from 'express'
import swaggerUi from 'swagger-ui-express'
import YAML from 'yamljs'
import { router as personRouter } from './routers/person-router.js'

dotenv.config();

const app = new express();
app.use(express.json());

const PORT = process.env.PORT || 1453;

app.use('/person', personRouter);

const swaggerDocument = YAML.load('api.yml');
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});