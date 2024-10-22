import { LightningElement, wire } from "lwc";
import {
  MessageContext,
  subscribe,
  unsubscribe
} from "lightning/messageService";
import Comrevo from "@salesforce/messageChannel/Comrevo__c";

export default class ShowAccountContacts extends LightningElement {
  subscription = null;

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
      });
    }
  }

  handleUnsubscribe() {
    unsubscribe(this.subscription);
    this.subscription = null;
  }
}
