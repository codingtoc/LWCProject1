import { LightningElement, wire, api } from "lwc";
import {
  MessageContext,
  subscribe,
  unsubscribe
} from "lightning/messageService";
import Comrevo from "@salesforce/messageChannel/Comrevo__c";
import getAccountContacts from "@salesforce/apex/AccountClass.getAccountContacts";

export default class ShowAccountContacts extends LightningElement {
  subscription = null;
  title = "Contacts";
  contacts;
  hasContacts;
  isAccountSelected = false;
  isAddContactClicked = false;
  isEditClicked = false;
  @api recordId;
  editableContactId;

  @wire(MessageContext)
  messageContext;

  accountId;
  accountName;

  connectedCallback() {
    this.handleSubscribe();
  }

  disconnectedCallback() {
    this.handleUnsubscribe();
  }

  handleSubscribe() {
    if (!this.subscription) {
      subscribe(this.messageContext, Comrevo, (message) => {
        this.accountId = message.accountId;
        this.accountName = message.accountName;
        this.title = this.accountName + "'s Contacts";
        this.getContacts();
      });
    }
  }

  async getContacts() {
    this.contacts = await getAccountContacts({ accountId: this.accountId });
    this.hasContacts = this.contacts.length > 0 ? true : false;
    this.isAccountSelected = true;
  }

  handleChange(event) {
    this.searchText = event.target.value;
  }

  handleUnsubscribe() {
    unsubscribe(this.subscription);
    this.subscription = null;
  }

  handleAddContact(event) {
    this.isAddContactClicked = true;
  }

  handleAddContactCancel(event) {
    this.isAddContactClicked = false;
  }

  handleEdit(event) {
    this.isEditClicked = true;
    this.editableContactId = event.target.dataset.contactId;
  }

  handleEditCancel(event) {
    this.isEditClicked = false;
  }

  handleSuccess(event) {
    this.isAddContactClicked = false;
    this.isEditClicked = false;
    this.getContacts();
  }
}
