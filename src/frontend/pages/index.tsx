// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import { NextPage } from 'next';
import Footer from '../components/Footer';
import Layout from '../components/Layout';
import ProductList from '../components/ProductList';
import * as S from '../styles/Home.styled';
import { useQuery } from '@tanstack/react-query';
import ApiGateway from '../gateways/Api.gateway';
import Banner from '../components/Banner';
import { CypressFields } from '../utils/Cypress';
import { useCurrency } from '../providers/Currency.provider';

const throwARandomError = () => {
  const random = Math.random();
  if (random > 0.5) {
    throw new Error('Random error: ' + random);
  }
  new Promise((resolve, reject) => {
    setTimeout(() => {
      reject('Random error: ' + random);
    }, 1000);
  });
};

const Home: NextPage = () => {
  const { selectedCurrency } = useCurrency();
  const { data: productList = [] } = useQuery(['products', selectedCurrency], () =>
    ApiGateway.listProducts(selectedCurrency)
  );

  return (
    <Layout>
      <S.Home data-cy={CypressFields.HomePage}>
        <Banner />
        <S.Container>
          <S.Row>
            <S.Content>
              <S.HotProducts>
                <S.HotProductsTitle data-cy={CypressFields.HotProducts} id="hot-products">
                  Hot Products
                </S.HotProductsTitle>
                <button onClick={() => throwARandomError()}>Throw a random error</button>
                <ProductList productList={productList} />
              </S.HotProducts>
            </S.Content>
          </S.Row>
        </S.Container>
        <Footer />
      </S.Home>
    </Layout>
  );
};

export default Home;
