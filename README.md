# siyuan-s3-config-generator

siyuan s3 sync config generator web

本仓库为思源笔记S3同步配置生成器，用于帮助不太了解S3配置的小白配置思源笔记的S3同步。只需要选择你使用的S3服务商和你的bucket地域，并输入你创建的bucket名字，网页就能展示出你应该在思源笔记中填写的S3配置项。

本项目为纯前端应用，所有的配置生成基于仓库中的yml文件，准确性依赖于仓库拥有者以及社区成员的实时更新，可能会出现滞后。

## 帮助共建

如果您有兴趣帮助本项目添加S3服务提供商，请遵循以下指导添加配置文件：

1. 修改 proviers.yml 配置文件，添加新的服务商名字和对应的配置文件名称

```yaml
  - name: "example"
    displayName: "示例提供商 / Example" # 显示在前台选择框中的S3服务商名称
    configFile: "example.yml"  # 对应的配置文件名称
```

2. 对应创建一个 providers/example.yml 配置文件，新增该服务商支持的地域和该地域对应的信息。

此处配置中地域分为了显示在选择栏中的名称和最终用户应该填写的地域。这样可以有效区分用户在S3服务商前台使用中文选择的地域（显示在下拉菜单中），和最终思源笔记内应该填写的对应英文region。

```yaml
buckets:
  - region: cn-hangzhou  # 显示在前台选择栏中的地域
    config:
      endpoint: oss-cn-hangzhou.aliyuncs.com
      region: cn-hangzhou # 最终用户应填写的地域
      addressing: "Path-style"
      tls: "Verify"
```

感谢您的共建！
