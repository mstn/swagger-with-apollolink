import React, { Component } from 'react';
import './App.css';

import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';

import { ApolloProvider } from 'react-apollo';

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { SwaggerLink, loadSwaggerSchema } from 'apollo-link-swagger';

async function createApolloClient() {
  const schema = await loadSwaggerSchema('http://petstore.swagger.io/v2/swagger.json');
  // swagger-to-graphql does not support primitive type file
  // we patch the schema by hand
  // https://github.com/yarax/swagger-to-graphql/issues/19
  delete schema.paths['/pet/{petId}/uploadImage'];
  console.log(schema);
  const link = new SwaggerLink({ schema });

  const client = new ApolloClient({
    link,
    cache: new InMemoryCache(),
    connectToDevTools: true,
  });
  return client;
}

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
    client: null
  };
  componentDidMount = () => {
    createApolloClient()
      .then( client => this.setState({client}) );
  }
  render() {
    return (
      <div>
        { !this.state.client && <p>Loading schema...</p> }
        { this.state.client && this.renderWithApolloProvider() }
      </div>
    );
  }
  renderWithApolloProvider() {
    return (
      <ApolloProvider client={this.state.client}>
        <PetStoreWithData />
      </ApolloProvider>
    );
  }
}

export default App;
