import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { IntrospectAndCompose } from '@apollo/gateway';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: true, // Example: Define your schema file here
      apollo: {
        gateway: {
          supergraphSdl: new IntrospectAndCompose({
            subgraphs: [],
          }),
        },
        driver: ApolloGatewayDriver,
      },
    }),
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
