import * as React from 'react';
import { Component } from 'react';
import { translate } from 'react-i18next';

import { DefaultLayout } from '../../layouts';
import { Container, Row, Link } from '../../common';

import { AccountNav } from '../account-nav';
import { Card } from './card';

import * as styles from './cards.scss';

import { CreditCardProps, getCreditCards } from '../../api/credit-cards';

export const cardsAction = async (params?: any, cookie?: any) => {
  const cards: CreditCardProps[] = await getCreditCards(cookie);

  return {
    component: <Cards cards={cards} />
  };
};

class CardsComponent extends Component<any, any> {
    constructor(props: { cards: CreditCardProps[], className: string, t: Function }) {
      super(props);

      this.state = {
        cards: props.cards
      };
    }

    render() {
        return (
            <DefaultLayout>
                <Container>
                    <div className={styles.pageContainer}>
                        <Row>
                            <div className={`${styles.colMd3} ${styles.navSection}`}>
                                <AccountNav currentPage="MY_CARDS_SHORT" />
                            </div> 

                            <div className={`${styles.colMd9} ${styles.col12}`}>
                                <div className={styles.container}>
                                    <h3 className={styles.pageTitle}>{this.props.t('account:MY_CARDS')}</h3>

                                    <div className={styles.cardsSection}>
                                        {this.state.cards.length ? (
                                          <Row>
                                            {this.state.cards.map((card: CreditCardProps, index: number) => (
                                              <Card key={index} card={card} className={`${styles.myCards} ${styles.colMd6} ${styles.colLg4}`} />
                                            ))}
                                          </Row>
                                        ) : (
                                          <div className={styles.emptyDesc}>{this.props.t('account:NO_CARD')}</div>
                                        )}
                                    </div>

                                </div>
                            </div>
                        </Row>
                    </div>

                </Container>
            </DefaultLayout>
        )
    }
}

const Cards = translate(['account'])(CardsComponent);
