import { Component } from 'react';
import { nanoid } from 'nanoid';
import { RiContactsBookFill } from "react-icons/ri";
import { ContactForm } from '../ContactForm/ContactForm';
import { ContactList } from '../ContactList/ContactList';
import { ContactFilter } from '../Filter/Filter';
import { Container, Title, Span, SubTitle, Text } from './App.styled';

export class App extends Component {
  state = {
    contacts: [
      { id: 'id-1', name: 'Rosie Simpson', number: '459-12-56' },
      { id: 'id-2', name: 'Hermione Kline', number: '443-89-12' },
      { id: 'id-3', name: 'Eden Clements', number: '645-17-79' },
    ],
    filter: '',
  };

  componentDidMount() {
    const savedContacts = localStorage.getItem('contacts');
    if (savedContacts) {
      this.setState({ contacts: JSON.parse(savedContacts) });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.contacts !== this.state.contacts) {
      localStorage.setItem('contacts', JSON.stringify(this.state.contacts));
    }
  }

  addContacts = data => {
    const { contacts } = this.state;

    const newContact = {
      id: nanoid(),
      ...data,
    };

    if (contacts.find(contact => contact.name.toLocaleLowerCase() === newContact.name.toLocaleLowerCase())) {
      alert(`${newContact.name} already exists.`);
      return;
    }

    this.setState(prevState => ({
      contacts: [...prevState.contacts, newContact],
    }));
  };

  findContacts = e => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  deletContacts = id => {
    this.setState(prev => ({
      contacts: prev.contacts.filter(item => item.id !== id),
    }));
  };

  viewContacts = () => {
    const { contacts, filter } = this.state;
    const normalizedFilter = filter.toLowerCase();
    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(normalizedFilter)
    );
  };

  render() {
    const visibleContacts = this.viewContacts();

    return (
      <Container>
        <RiContactsBookFill style={{width:'100px', height:'100px', color:'#3373e2'}}/>
        <Title>Phone<Span>book</Span></Title>
        <ContactForm setContacts={this.addContacts} />
        <SubTitle>Contacts List</SubTitle>
        <ContactFilter
          value={this.state.filter}
          findContacts={this.findContacts}
        />

        {visibleContacts.length === 0 ? (
          <Text>Sorry, you don't have any contacts.</Text>
        ) : (
          <ContactList
            data={visibleContacts}
            deletContacts={this.deletContacts}
          />
        )}
      </Container>
    );
  }
}
