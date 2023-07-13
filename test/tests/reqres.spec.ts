import axios, { AxiosResponse } from 'axios';
import * as fixtures from '../fixtures';
import * as Types from '../types';

axios.defaults.baseURL = 'https://reqres.in/api';
axios.defaults.validateStatus = (status) => status <= 500;

const oneToThreeDigits = /^\d{1,3}$/;
const dateInISOFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;

describe('ReqRes API', () => {
  test('GET to /users should return status 200 and a list of users', async () => {
    // Act
    const response: AxiosResponse<Types.UserList> = await axios({
      url: '/users',
      method: 'get',
      params: { page: 2 },
    });

    // Assert
    expect(response.status).toBe(200);

    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );

    const responseBody = response.data;
    expect(responseBody.page).toBe(2);
    expect(responseBody.per_page).toBe(6);
    expect(responseBody.total).toBe(12);
    expect(responseBody.total_pages).toBe(2);
    expect(responseBody.data).toHaveLength(6);

    for (let i = 0; i < fixtures.users.length; i += 1) {
      const responseUsersData = responseBody.data;
      expect(responseUsersData[i].id).toBe(fixtures.users[i].id);
      expect(responseUsersData[i].email).toBe(fixtures.users[i].email);
      expect(responseUsersData[i].first_name).toBe(
        fixtures.users[i].first_name
      );
      expect(responseUsersData[i].last_name).toBe(fixtures.users[i].last_name);
      expect(responseUsersData[i].avatar).toBe(fixtures.users[i].avatar);
    }
  });

  test('GET to /users/id for an existing user should return status 200 and the user data', async () => {
    // Act
    const response: AxiosResponse<Types.SingleUser> = await axios({
      url: '/users/2',
      method: 'get',
    });

    // Assert
    expect(response.status).toBe(200);

    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );

    const responseUserData = response.data.data;
    expect(responseUserData.id).toBe(2);
    expect(responseUserData.email).toBe('janet.weaver@reqres.in');
    expect(responseUserData.first_name).toBe('Janet');
    expect(responseUserData.last_name).toBe('Weaver');
    expect(responseUserData.avatar).toBe(
      'https://reqres.in/img/faces/2-image.jpg'
    );
  });

  test('GET to /users/id for a user that does not exist should return status 404', async () => {
    // Act
    const response: AxiosResponse<object> = await axios({
      url: '/users/23',
      method: 'get',
    });

    // Assert
    expect(response.status).toBe(404);

    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );

    expect(response.data).toEqual({});
  });

  test('GET to /colors should return status 200 and a list of colors', async () => {
    // Act
    const response: AxiosResponse<Types.ColorList> = await axios({
      url: '/colors',
      method: 'get',
    });

    // Assert
    expect(response.status).toBe(200);

    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );

    const responseBody = response.data;
    expect(responseBody.page).toBe(1);
    expect(responseBody.per_page).toBe(6);
    expect(responseBody.total).toBe(12);
    expect(responseBody.total_pages).toBe(2);
    expect(responseBody.data).toHaveLength(6);

    for (let i = 0; i < fixtures.colors.length; i += 1) {
      const responseColorsData = responseBody.data;
      expect(responseColorsData[i].id).toBe(fixtures.colors[i].id);
      expect(responseColorsData[i].name).toBe(fixtures.colors[i].name);
      expect(responseColorsData[i].year).toBe(fixtures.colors[i].year);
      expect(responseColorsData[i].color).toBe(fixtures.colors[i].color);
      expect(responseColorsData[i].pantone_value).toBe(
        fixtures.colors[i].pantone_value
      );
    }
  });

  test('GET to /colors/id for an existing color should return status 200 and the color data', async () => {
    // Act
    const response: AxiosResponse<Types.SingleColor> = await axios({
      url: '/colors/2',
      method: 'get',
    });

    // Assert
    expect(response.status).toBe(200);

    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );

    const responseColorData = response.data.data;
    expect(responseColorData.id).toBe(2);
    expect(responseColorData.name).toBe('fuchsia rose');
    expect(responseColorData.year).toBe(2001);
    expect(responseColorData.color).toBe('#C74375');
    expect(responseColorData.pantone_value).toBe('17-2031');
  });

  test('GET to /colors/id for a color that does not exist should return status 404', async () => {
    // Act
    const response: AxiosResponse<object> = await axios({
      url: '/colors/23',
      method: 'get',
    });

    // Assert
    expect(response.status).toBe(404);

    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );

    expect(response.data).toEqual({});
  });

  test('POST to /users with valid data should return status 201 and the user data', async () => {
    // Arrange
    const requestBody: Types.CreateOrUpdateUserRequest = {
      name: 'morpheus',
      job: 'leader',
    };

    // Act
    const response: AxiosResponse<Types.CreateUserResponse> = await axios({
      url: '/users',
      method: 'post',
      data: requestBody,
    });

    // Assert
    expect(response.status).toBe(201);

    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );

    const responseBody = response.data;
    expect(responseBody.name).toBe(requestBody.name);
    expect(responseBody.job).toBe(requestBody.job);
    expect(responseBody.id).toMatch(oneToThreeDigits);
    expect(responseBody.createdAt).toMatch(dateInISOFormat);
  });

  test('PUT to /users/id for an existing user with valid data should return status 200 and the user data', async () => {
    // Arrange
    const requestBody: Types.CreateOrUpdateUserRequest = {
      name: 'morpheus',
      job: 'zion resident',
    };

    // Act
    const response: AxiosResponse<Types.UpdateUserResponse> = await axios({
      url: '/users/2',
      method: 'put',
      data: requestBody,
    });

    // Assert
    expect(response.status).toBe(200);

    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );

    const responseBody = response.data;
    expect(responseBody.name).toBe(requestBody.name);
    expect(responseBody.job).toBe(requestBody.job);
    expect(responseBody.updatedAt).toMatch(dateInISOFormat);
  });

  test('PATCH to /users/id for an existing user with valid data should return status 200 and the user data', async () => {
    // Arrange
    const requestBody: Types.CreateOrUpdateUserRequest = {
      name: 'morpheus',
      job: 'zion resident',
    };

    // Act
    const response: AxiosResponse<Types.UpdateUserResponse> = await axios({
      url: '/users/2',
      method: 'patch',
      data: requestBody,
    });

    // Assert
    expect(response.status).toBe(200);

    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );

    const responseBody = response.data;
    expect(responseBody.name).toBe(requestBody.name);
    expect(responseBody.job).toBe(requestBody.job);
    expect(responseBody.updatedAt).toMatch(dateInISOFormat);
  });

  test('DELETE to /users/id for an existing user should return status 204', async () => {
    // Act
    const response: AxiosResponse<void> = await axios({
      url: '/users/2',
      method: 'delete',
    });

    // Assert
    expect(response.status).toBe(204);

    expect(response.headers['content-length']).toBe('0');
  });

  test('POST to /register with valid data should return status 200 and the registration id and token', async () => {
    // Arrange
    const requestBody: Types.RegisterOrLoginRequest = {
      email: 'eve.holt@reqres.in',
      password: 'pistol',
    };

    // Act
    const response: AxiosResponse<Types.RegisterResponse> = await axios({
      url: '/register',
      method: 'post',
      data: requestBody,
    });

    // Assert
    expect(response.status).toBe(200);

    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );

    const responseBody = response.data;
    expect(responseBody.id).toBe(4);
    expect(responseBody.token).toBe('QpwL5tke4Pnpja7X4');
  });

  test('POST to /register with missing password should return status 400 and the validation error', async () => {
    // Arrange
    const requestBody: Types.RegisterOrLoginRequest = {
      email: 'sydney@fife',
    };

    // Act
    const response: AxiosResponse<Types.ErrorResponse> = await axios({
      url: '/register',
      method: 'post',
      data: requestBody,
    });

    // Assert
    expect(response.status).toBe(400);

    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );

    expect(response.data.error).toBe('Missing password');
  });

  test('POST to /login with valid data should return status 200 and the login token', async () => {
    // Arrange
    const requestBody: Types.RegisterOrLoginRequest = {
      email: 'eve.holt@reqres.in',
      password: 'pistol',
    };

    // Act
    const response: AxiosResponse<Types.LoginResponse> = await axios({
      url: '/login',
      method: 'post',
      data: requestBody,
    });

    // Assert
    expect(response.status).toBe(200);

    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );

    expect(response.data.token).toBe('QpwL5tke4Pnpja7X4');
  });

  test('POST to /login with missing password should return status 400 and the validation error', async () => {
    // Arrange
    const requestBody: Types.RegisterOrLoginRequest = {
      email: 'peter@klaven',
    };

    // Act
    const response: AxiosResponse<Types.ErrorResponse> = await axios({
      url: '/login',
      method: 'post',
      data: requestBody,
    });

    // Assert
    expect(response.status).toBe(400);

    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );

    expect(response.data.error).toBe('Missing password');
  });
});
