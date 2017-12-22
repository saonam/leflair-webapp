import * as React from 'react';
import { Component, SFC } from 'react';
import { translate } from 'react-i18next';

import * as styles from './phone-input.scss';

import { TextInput, TextInputProps } from './text-input';

export default class PhoneInput extends React.Component<TextInputProps, {}>  {
    constructor(props: TextInputProps) {
      super(props);

      this.handleChange = this.handleChange.bind(this);
      this.validate = this.validate.bind(this);
    }

    handleChange(data: { value: string }) {
      if (/^\+?([0-9 ]+)?$/.test(data.value)) {
        this.setState(data, () => this.props.onFieldChanged(data));
      }
    }

    validate(e: any) {
      if (!/[0-9 \+]/.test(e.key)) {
        e.preventDefault();
      }
    }

    render() {
      return (
        <TextInput
          {...this.props}
          type="tel"
          name={this.props.name || 'phone'}
          value={this.props.value}
          onFieldChanged={this.handleChange}
          onKeyPress={this.validate}
          maxLength={20}
        />
      );
    }
}
