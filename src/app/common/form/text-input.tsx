import * as React from 'react';
import { Component, SFC } from 'react';

import * as styles from './text-input.scss';

import { ReturnInput } from './return-input.type';

export interface TextInputProps {
    disabledFormGroup?: boolean;
    label?: string;
    placeholder?: string;
    className?: string;
    value?: string;
    type?: string;
    name?: string;
    onFieldChanged: Function;
    required?: boolean;
    disabled?: boolean;
    small?: string;
    autoComplete?: string;
    onKeyPress?: Function;
    maxLength?: number;
};

export class TextInput extends React.Component<TextInputProps, {}>  {
    constructor(props: TextInputProps) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        return (
            <div className={this.props.disabledFormGroup ? '' : styles.formGroup}>
                {this.props.label && <label htmlFor={this.props.name}>{this.props.label}</label>}
                <input 
                    id={this.props.name}
                    type={this.props.type}
                    name={this.props.name}
                    autoComplete={this.props.autoComplete}
                    placeholder={this.props.placeholder}
                    className={`${this.props.className || ''} ${styles.formControl}`}
                    value={this.props.value}
                    onChange={this.handleChange}
                    required={this.props.required || false}
                    disabled={this.props.disabled || false}
                    onKeyPress={e => this.props.onKeyPress && this.props.onKeyPress(e)}
                    maxLength={this.props.maxLength || null}
                />
                {this.props.small && <small className={`${styles.formText} ${styles.textMuted}`}>{this.props.small}</small>}
            </div>
        );
    }

    handleChange(event: any) {
        const updateData: ReturnInput = {
            value: event.target.value
        };
        this.props.onFieldChanged(updateData);
    }
}
