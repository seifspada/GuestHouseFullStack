// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import * as express from 'express'; // Import express for static file serving
import { join } from 'path'; // Import path for directory resolution

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Serve static files from the uploads directory
  app.use('/uploads', express.static(join(process.cwd(), 'uploads')));

  // Enable CORS for the Angular frontend
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:4200',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Set up global validation pipe
app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Enable automatic type transformation
      transformOptions: { enableImplicitConversion: true }, // Convert strings to numbers/booleans
    }),
  );

  
  // Drop the username_1 index if it exists
  try {
    const connection = app.get<Connection>(getConnectionToken());
    const indexes = await connection.collection('users').indexes();

    if (indexes.find((i) => i.name === 'username_1')) {
      await connection.collection('users').dropIndex('username_1');
      console.log('✅ Index "username_1" dropped successfully.');
    } else {
      console.log('ℹ️ Index "username_1" not found.');
    }
  } catch (error) {
    console.error('❌ Error dropping index:', error.message, error.stack);
  }

  // Start the server
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Server started on http://localhost:${port}`);
}

bootstrap();