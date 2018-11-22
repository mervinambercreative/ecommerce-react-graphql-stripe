import React, { Component} from 'react';
import { Container, Box, Heading, Card, Image, Text, SearchField, Icon } from 'gestalt';
import { Link } from 'react-router-dom';
import './App.css';
import Strapi from 'strapi-sdk-javascript/build/main';
const apiUrl = process.env.API_URL || 'http://localhost:1337';
const strapi = new Strapi(apiUrl);

class App extends Component {
  state = {
    brands: [],
    searchTerm: ' '
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

  handleChange = ({value}) => {
    this.setState({ searchTerm: value});
  }

  filteredBrands = ({ searchTerm, brands }) => {
    return brands.filter(brand => {
      return brand.name.toLowerCase().includes(searchTerm.toLowerCase());
    });
  };

  render() {
    const { searchTerm } = this.state;
    return (
      <Container>
        <Box display="flex" justifyContent="center" marginTop={10} marginBottom={10}>
          <SearchField id="searchField" accessibilityLabel="Branch Search Field" onChange={this.handleChange} placeholder="Search Brands" />
          <Box margin={3}>
            <Icon icon="filter" color={searchTerm ? 'orange' : 'gray'} size={20} accessibilityLabel="Filter" />
          </Box>
        </Box>

        <Box display="flex" justifyContent="center" marginBottom={2}>
          <Heading color="midnight" size="md">
            Brew Brands
          </Heading>
        </Box>
        <Box display="flex" justifyContent="around" direction="row" alignItems="center">

          {this.filteredBrands(this.state).map(brands => (
            <Box wrap key={brands._id} height={200} width={200}>
              <Card image={
                <Box height={200} width={200}>
                  <Image alt="Brand" naturalHeight={2} naturalWidth={2} src={`${apiUrl}${brands.image.url}`} />
                </Box>
              }>
              <Text size="xl" align="center">{brands.name}</Text>
              <Text align="center">{brands.Description}</Text>
              <Text size="xl" align="center">
                <Link to={`/${brands._id}`}>See Brews</Link>
              </Text>
              </Card>
            </Box>
          ))}

        </Box>
      </Container>
    );
  }
}

export default App;
