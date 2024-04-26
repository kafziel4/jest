import { ReqResClient } from '../clients/reqres-client';
import {
  headers,
  jsonContentType,
  missingPassword,
} from '../fixtures/constants';
import { ErrorResponse } from '../types/common';
import { RegisterRequest, RegisterResponse } from '../types/register';

let reqResClient: ReqResClient;

describe('ReqRes API Register endpoints', () => {
  beforeAll(() => {
    reqResClient = new ReqResClient();
  });

  test('POST to /register with valid data should return status 200 and the registration id and token', async () => {
    // Arrange
    const requestBody: RegisterRequest = {
      email: 'eve.holt@reqres.in',
      password: 'pistol',
    };

    const expectedResponse: RegisterResponse = {
      id: 4,
      token: 'QpwL5tke4Pnpja7X4',
    };

    // Act
    const response = await reqResClient.postRegister(requestBody);

    // Assert
    expect(response.status).toBe(200);
    expect(response.headers[headers.contentType]).toBe(jsonContentType);
    expect(response.data).toEqual(expectedResponse);
  });

  test('POST to /register with missing password should return status 400 and the validation error', async () => {
    // Arrange
    const requestBody: RegisterRequest = {
      email: 'sydney@fife',
    };

    const expectedResponse: ErrorResponse = {
      error: missingPassword,
    };

    // Act
    const response = await reqResClient.postRegister(requestBody);

    // Assert
    expect(response.status).toBe(400);
    expect(response.headers[headers.contentType]).toBe(jsonContentType);
    expect(response.data).toEqual(expectedResponse);
  });
});
