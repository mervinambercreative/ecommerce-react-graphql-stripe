import React, { Component} from 'react';
import { Container, Box, Heading, Card, Image } from 'gestalt';
import './App.css';
import Strapi from 'strapi-sdk-javascript/build/main';
const apiUrl = process.env.API_URL || 'http://localhost:1337';
const strapi = new Strapi(apiUrl);

class App extends Component {
  state = {
    brands: []
  }
  async componentDidMount(){
    try{
      const response = await strapi.request('POST', '/graphql',{
        data:{
          query: `query{
            brands{
              id
              name
              Description
              image{
                url
              }
            }
          }`
        }
      });
      //console.log(response);
      this.setState({ brands: response.data.brands });
    } catch (err){
      console.error(err);
    }
  }

  render() {
    const { brands } = this.state;
    return (
      <Container>
        <Box display="flex" justifyContent="center" marginBottom={2}>
          <Heading color="midnight" size="md">
            Brew Brands
          </Heading>
        </Box>
        <Box display="flex" justifyContent="center">
          {brands.map(brands => (
            <Box key={brands._id}>
              <Card image={
                <Box height={200} width={200}>
                  <Image
                  alt="Brand"
                  naturalHeight={2}
                  naturalWidth={1}
                  src={`${apiUrl}${brands.image.url}`} />
                </Box>
              }>
              </Card>
            </Box>
          ))}
        </Box>
      </Container>
    );
  }
}

export default App;
