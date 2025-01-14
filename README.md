#  سرویس پیام رسان 
## پیش‌نیازها

برای راه‌اندازی این سرویس، باید موارد زیر نصب شده باشند:
- [Node.js](https://nodejs.org/)
- [NestJS CLI](https://nestjs.com/)

## نصب

1. مخزن پروژه را کلون کنید:
   ```bash
   git clone <repository_url>
   cd <repository_directory>
   ```
2. وابستگی‌ها را نصب کنید:

```bash
npm install
```
## راه‌اندازی
برای اجرا میتوانید با توجه به محیط مورد نظر هر یک دستورات زیر را اجرا کنید:
```bash
npm run start
npm run start:dev
npm run start:debug
npm run start:prod
```
## API‌ها

<details open>
<summary>دریافت همه پیام‌ها</summary>
<br>

<div dir="ltr">

###  API URL
```
URL: api/message/user
Method: GET
```
### Request Body
 ```
 None
 ```

### Authentication

```
Bearer Token
Token: <token>
```

### Response
</div>

خروجی بصورت های زیر می باشد:

در حالت صحیح
<div dir="ltr">

```json
{
  "data": {
    "user_id": [
      {
        "id": "string",
        "content": "string",
        "senderId": "string",
        "receiverId": "string",
        "isRead": true,
        "fileId": "string or null",
        "createdAt": "string"
      }
    ]
  },
  "meta": {
    "requestId": "string"
  }
}

```
</div>

در حالت خطا

<div dir="ltr">

```json
{
   "data": {
      "message": "string",
      "path": "string",
      "statusCode": "integer"
   },
   "meta": {
      "requestId": "string"
   }
}
```
### Example

```js
// output: correct
{
   "data": 
   {
     "e8806898-d6a3-4799-890a-1d854624c3ca": [
     {
       "id": "da9f44ab-d700-4afc-bf08-8f6026acf2ce",
       "content": "hello again",
       "senderId": "e8806898-d6a3-4799-890a-1d854624c3ca",
       "receiverId": "e8806898-d6a3-4799-890a-1d854624c3ca",
       "isRead": false,
       "fileId": null,
       "createdAt": "2025-01-14T05:49:48.219Z"
     },
     {
       "id": "9d3eaf29-6ad8-419a-8626-911d81bf2861",
       "content": "hello again",
       "senderId": "e8806898-d6a3-4799-890a-1d854624c3ca",
       "receiverId": "e8806898-d6a3-4799-890a-1d854624c3ca",
       "isRead": false,
       "fileId": null,
       "createdAt": "2025-01-14T05:39:38.678Z"
     },....
   },
   "meta": 
   {
     "requestId": "bb54fb5a-0bee-4081-a323-02407253a805"
   }
}
// output: wrong
{
   'data': 
   {
     'statusCode': 401,
     'message': 'Invalid or expired token',
     'path': '/api/message/user';
   },
   'meta':
   {
     'requestId': '5ef04555-4168-45c2-9bbb-2e7645e6006e';
   }
}
```
</div>
</details>

<details open>
<summary>فرستادن پیام</summary>
<br>

<div dir="ltr">

###  API URL
```
URL: api/message/send
Method: POST
```
### Request Body
</div>
تعریف ورودی درخواست بصورت صحیح زیر بایستی انجام شود:

<div dir="ltr">

``` json
{
   "receiverId": "string",
   "content": "string"
}
```

### Authentication

```
Bearer Token
Token: <token>
```


### Response
</div>

خروجی بصورت های زیر می باشد:

در حالت صحیح
<div dir="ltr">

```json
{
   "data": {
      "message": "string",
      "messageId": "string"
   },
   "meta": {
      "requestId": "string"
   }
}
```
</div>

در حالت خطا

<div dir="ltr">

```json
{
   "data": {
      "message": "string",
      "path": "string",
      "statusCode": "integer"
   },
   "meta": {
      "requestId": "string"
   }
}
```
### Example

```js
// input
{
  "receiverId": "e8806898-d6a3-4799-890a-1d854624c3ca",
  "content": "hello again"
  
}
// output: correct
{
   "data": 
   {
     "status": "success",
     "messageId": "421d7acd-875f-4e0e-97de-770e642bc467"
   },
   "meta": 
   {
     "requestId": "bb54fb5a-0bee-4081-a323-02407253a805"
   }
}
// output: wrong
{
   'data': 
   {
     'statusCode': 400,
     'message': 'Invalid receiver',
     'path': 'api/message/send';
   },
   'meta':
   {
     'requestId': '5ef04555-4168-45c2-9bbb-2e7645e6006e';
   }
}
```
</div>

</details>