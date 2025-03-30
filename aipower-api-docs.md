# 影刀AI Power
AI Power是一款面向企业及个人的，无代码开发AI应用的产品。全面聚合AI能力，轻松创建AI应用。通过企业知识库、集成全球大模型、预置丰富AI组件、可视化搭建工作流、多样集成调用等功能，打造All in One的企业级AI工作站，帮助企业有效整合孤立的内部、外部系统，让AI无缝衔接企业业务，助力企业快速提效。
说明文档：https://ying-dao.feishu.cn/wiki/WEHdwt00xibvWmkmCLhco19sn1b
视频教程：https://space.bilibili.com/393215006/lists/4490679?type=series

# 1. AI工作流异步运行

| HTTP URL    | https://power-api.yingdao.com/oapi/power/v1/rest/flow/#{flowUuid}/execute/async |
| ----------- | ------------------------------------------------------------------------------- |
| HTTP Method | POST                                                                            |

**请求头**

| **名称**        | **类型** | **是否必填** | **描述**                                                                      |
| ------------- | ------ | -------- | --------------------------------------------------------------------------- |
| Content-Type  | string | 是        | **固定值**："application/json; charset=utf-8"                                   |
| Authorization | string | 是        | AP的认证token**示例值**：Bearer AP\_gd334OdglavccmpdK可在AP首页左下角账号设置 -> 影刀AP Token获取 |

**路径参数**

| **名称**   | **类型** | **是否必填** | **描述**    |
| -------- | ------ | -------- | --------- |
| flowUuid | string | 是        | AI工作流uuid |

**请求体**

| **名称** | **类型** | **是否必填** | **描述**    |
| ------ | ------ | -------- | --------- |
| input  | json对象 | 是        | AI工作流运行参数 |

**响应体**

| **名称**    | **类型**  | **描述**             |
| --------- | ------- | ------------------ |
| code      | int     | 业务状态码200-成功，非200失败 |
| success   | boolean | true-成功false-失败    |
| msg       | string  | 失败信息               |
| data      |         | 数据实体               |
| requestId | string  | 请求id               |



**data响应体结构**

| **名称**      | **类型** | **描述**      |
| ----------- | ------ | ----------- |
| runRecordId | long   | AI工作流运行记录id |

**请求示例**

```json
url:/oapi/power/v1/rest/flow/b32d20ff-0c3f-4bd5-ad36-694ad4a24ea3/execute/async

body:
{
    "input": {
        "input_text_0": "你好"
    }
}

response
{
    "data": {
        "runRecordId": 219948788285440
    },
    "code": 200,
    "success": true,
    "requestId": "f5c135d7-b519-4e53-a852-385a7fe5c66c"
}
```

# 2. 查询AI工作流运行结果

| HTTP URL    | https://power-api.yingdao.com/oapi/power/v1/rest/flow/execute/result |
| ----------- | -------------------------------------------------------------------- |
| HTTP Method | GET                                                                  |

**请求头**

| **名称**        | **类型** | **是否必填** | **描述**                                                                      |
| ------------- | ------ | -------- | --------------------------------------------------------------------------- |
| Content-Type  | string | 是        | **固定值**："application/json; charset=utf-8"                                   |
| Authorization | string | 是        | AP的认证token**示例值**：Bearer AP\_gd334OdglavccmpdK可在AP首页左下角账号设置 -> 影刀AP Token获取 |

**查询参数**

| **名称**      | **类型** | **是否必填** | **描述**      |
| ----------- | ------ | -------- | ----------- |
| runRecordId | long   | 是        | AI工作流运行记录id |



**响应体**

| **名称**    | **类型**  | **描述**             |
| --------- | ------- | ------------------ |
| code      | int     | 业务状态码200-成功，非200失败 |
| success   | boolean | true-成功false-失败    |
| msg       | string  | 失败信息               |
| data      |         | 数据集合               |
| requestId | string  | 请求id               |



**data响应体结构**

| **名称**     | **类型** | **描述**                             |
| ---------- | ------ | ---------------------------------- |
| status     | string | 运行状态pending-运行中success-成功failed-失败 |
| result     | json对象 | 运行结果                               |
| failReason | string | 失败原因                               |

**请求示例**

```json
url:/oapi/power/v1/rest/flow/execute/result?runRecordId=219948788285440

response:
{
    "data": {
        "status": "success",
        "result": {
            "output_text_0": "你好"
        },
        "failReason": ""
    },
    "code": 200,
    "success": true,
    "requestId": "c0ba2795-e05d-4d9b-bd24-ca8ae01aa411"
}
```

# 3. AI工作流同步运行

| HTTP URL    | https://power-api.yingdao.com/oapi/power/v1/rest/flow/#{flowUuid}/execute |
| ----------- | ------------------------------------------------------------------------- |
| HTTP Method | POST                                                                      |

**请求头**

| **名称**        | **类型** | **是否必填** | **描述**                                                                      |
| ------------- | ------ | -------- | --------------------------------------------------------------------------- |
| Content-Type  | string | 是        | **固定值**："application/json; charset=utf-8"                                   |
| Authorization | string | 是        | AP的认证token**示例值**：Bearer AP\_gd334OdglavccmpdK可在AP首页左下角账号设置 -> 影刀AP Token获取 |

**路径参数**

| **名称**   | **类型** | **是否必填** | **描述**    |
| -------- | ------ | -------- | --------- |
| flowUuid | string | 是        | AI工作流uuid |

**请求体**

| **名称** | **类型** | **是否必填** | **描述**    |
| ------ | ------ | -------- | --------- |
| input  | json对象 | 是        | AI工作流运行参数 |

**响应体**

| **名称**    | **类型**  | **描述**             |
| --------- | ------- | ------------------ |
| code      | int     | 业务状态码200-成功，非200失败 |
| success   | boolean | true-成功false-失败    |
| msg       | string  | 失败信息               |
| data      |         | 数据集合               |
| requestId | string  | 请求id               |



**data响应体结构**

| **名称**      | **类型** | **描述**      |
| ----------- | ------ | ----------- |
| runRecordId | long   | AI工作流运行记录id |
| result      | json数组 | 输出节点数据      |

**请求示例**

```json
url:/oapi/power/v1/rest/flow/b32d20ff-0c3f-4bd5-ad36-694ad4a24ea3/execute/async

body:
{
    "input": {
        "input_text_0": "你好"
    }
}

成功情况
response
{
    "data": {
        "runRecordId": 230861165690880,
        "result": {
            "output_text_0": "Hello"
        }
    },
    "code": 200,
    "success": true,
    "requestId": "00b25f17-951b-497d-97df-76489f68796c"
}

失败情况
{
    "code": 500,
    "success": false,
    "requestId": "a60243a7-d0ab-47b4-b829-97c5d32c692a",
    "msg": "运行失败，存在输入组件内容为空，请检查"
}
```

# 4. 分页查询AI工作流列表-已发版

| HTTP URL    | https://power-api.yingdao.com/oapi/power/v1/flow/page |
| ----------- | ----------------------------------------------------- |
| HTTP Method | GET                                                   |

**请求头**

| **名称**        | **类型** | **是否必填** | **描述**                                                                      |
| ------------- | ------ | -------- | --------------------------------------------------------------------------- |
| Content-Type  | string | 是        | **固定值**："application/json; charset=utf-8"                                   |
| Authorization | string | 是        | AP的认证token**示例值**：Bearer AP\_gd334OdglavccmpdK可在AP首页左下角账号设置 -> 影刀AP Token获取 |

**路径参数**

| **名称** | **类型** | **是否必填** | **描述**    |
| ------ | ------ | -------- | --------- |
| page   | int    | 是        | 页号        |
| size   | int    | 是        | 每页的数量     |
| name   | string | 否        | 名称-支持模糊搜索 |

**响应体**

| **名称**    | **类型**  | **描述**             |
| --------- | ------- | ------------------ |
| code      | int     | 业务状态码200-成功，非200失败 |
| success   | boolean | true-成功false-失败    |
| msg       | string  | 失败信息               |
| data      |         | 数据集合               |
| page      |         | 分页数据               |
| requestId | string  | 请求id               |

**data响应体结构**

| **名称**   | **类型** | **描述**    |
| -------- | ------ | --------- |
| flowUuid | string | AI工作流uuid |
| name     | string | AI工作流名称   |

**page响应体结构**

| **名称** | **类型** | **描述** |
| ------ | ------ | ------ |
| total  | int    | 数据总条数  |
| size   | int    | 每页数量   |
| pages  | int    | 总页数    |

**请求示例**

```json
url:/opai/power/v1/flow/page?page=1&size=3


response
{
    "data": [
        {
            "flowUuid": "f8907bc6-5f0d-4db0-9df8-f7a2f63ec2c3",
            "name": "未命名的AI工作流192"
        },
        {
            "flowUuid": "0c02c3fa-87dd-4619-ac22-4c6053394ad9",
            "name": "java程序员"
        },
        {
            "flowUuid": "4e3c0eae-076c-4111-b303-8fd1f4578b51",
            "name": "未命名的AI工作流218"
        }
    ],
    "page": {
        "total": 94,
        "size": 3,
        "page": 1,
        "pages": 32,
        "offset": 0,
        "order": "desc"
    },
    "code": 200,
    "success": true,
    "requestId": "ae801888-091a-4898-821a-58d9639e1028"
}
```



# 5. 查询AI工作流详情-已发版

| HTTP URL    | https://power-api.yingdao.com/oapi/power/v1/flow/detail |
| ----------- | ------------------------------------------------------- |
| HTTP Method | GET                                                     |

**请求头**

| **名称**        | **类型** | **是否必填** | **描述**                                                                      |
| ------------- | ------ | -------- | --------------------------------------------------------------------------- |
| Content-Type  | string | 是        | **固定值**："application/json; charset=utf-8"                                   |
| Authorization | string | 是        | AP的认证token**示例值**：Bearer AP\_gd334OdglavccmpdK可在AP首页左下角账号设置 -> 影刀AP Token获取 |

**路径参数**

| **名称**   | **类型** | **是否必填** | **描述**    |
| -------- | ------ | -------- | --------- |
| flowUuid | string | 是        | AI工作流uuid |

**响应体**

| **名称**    | **类型**  | **描述**             |
| --------- | ------- | ------------------ |
| code      | int     | 业务状态码200-成功，非200失败 |
| success   | boolean | true-成功false-失败    |
| msg       | string  | 失败信息               |
| data      |         | 实体数据               |
| requestId | string  | 请求id               |

**data响应体结构**

| **名称**   | **类型**   | **描述**    |
| -------- | -------- | --------- |
| flowUuid | string   | AI工作流uuid |
| name     | string   | AI工作流名称   |
| inputs   | json对象数组 | 输入节点数组    |
| output   | outputs  | 输出节点数组    |

**inputs、outputs结构**

| **名称**  | **类型** | **描述**                                               |
| ------- | ------ | ---------------------------------------------------- |
| label   | string | 节点名称仅做展示用                                            |
| name    | string | 参数名称调用运行接口时的传参                                       |
| type    | string | 参数类型TEXT-文本类型IMAGE-图片类型FILE-文件类型VIDEO-视频类型AUDIO-音频类型 |
| accept  | string | 可以接收的图片、文件类型以","分隔                                   |
| maxSize | int    | 最大文件大小，单位MB目前只有音频、视频有限制                              |

**请求示例**

```json
url:/opai/power/v1/flow/detail?flowUuid=f5f22d52-65b3-417e-ba9a-2ca2580be545

response
{
    "data": {
        "flowUuid": "f5f22d52-65b3-417e-ba9a-2ca2580be545",
        "name": "未命名的AI工作流224",
        "inputs": [
            {
                "label": "请上传图片",
                "name": "input_image_0",
                "type": "IMAGE",
                "accept": ".png,.jpg,.jpeg,.svg,.gif,.webp",
                "maxSize": 10
            },
            {
                "label": "请输入文本",
                "name": "input_text_0",
                "type": "TEXT"
            }
        ],
        "outputs": [
            {
                "label": "输出的文本",
                "name": "output_text_0",
                "type": "TEXT"
            }
        ]
    },
    "code": 200,
    "success": true,
    "requestId": "8b987a08-f6d4-4757-930e-6766fa4753dd"
}
```

