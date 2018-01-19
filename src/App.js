import React, { Component } from 'react';
import './App.css';

import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { SchemaLink } from "apollo-link-schema";

import { ApolloProvider } from 'react-apollo';

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const toGraphQLSchema = require('swagger-to-graphql');

function PetStore(props) {
  const {
    data: {
      loading,
      viewer,
    }
  } = props;
  return (
    <div>
    { loading ?
        "Loading available pets"
      :
      (
        <ul>
          {
            viewer.findPetsByStatus.map(
              ( pet, index ) => (
                <li id={pet.id} key={pet.id+index}>{pet.name}</li>
              )
            )
          }
        </ul>
      )
    }
    </div>
  );
}

const PetStoreWithData = graphql(gql`
  query {
    viewer {
      findPetsByStatus(status: ["available"] ) {
        id
        name
      }
    }
  }
`)(PetStore);

class App extends Component {
  state = {
    schema: undefined
  }
  componentDidMount = () => {
    fetch('http://petstore.swagger.io/v2/swagger.json')
      .then( (response) => response.json())
      .then( (swaggerSchema) => {
        // swagger-to-graphql does not support primitive type file
        // we patch the schema by hand
        // https://github.com/yarax/swagger-to-graphql/issues/19
        delete swaggerSchema.paths['/pet/{petId}/uploadImage'];
        return toGraphQLSchema(swaggerSchema)
      })
      .then( (schema) => this.setState({schema}) );
  }
  render() {
    return (
      <div>
        { !this.state.schema && <p>Loading...</p> }
        { this.state.schema && this.renderWithApolloProvider() }
      </div>
    );
  }
  renderWithApolloProvider = () => {
    const { schema } = this.state;
    const client = new ApolloClient({
      link: new SchemaLink({
        schema,
        context: {
          GQLProxyBaseUrl: 'http://petstore.swagger.io/v2'
        }
      }),
      cache: new InMemoryCache(),
      connectToDevTools: true,
    });
    return (
      <ApolloProvider client={client}>
        <PetStoreWithData />
      </ApolloProvider>
    );
  }
}

export default App;
