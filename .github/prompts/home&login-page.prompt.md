---
mode: 'agent'
---

然后添加homapage，并将 #file:../../src/pages/ChatPage.tsx 路由到/chat url下。请你发挥创造力，让homepage尽量漂亮美观，并添加适当的动效来吸引用户。homepage应当添加 #file:../../public/icon.png 来突出品牌，并适当添加文字来说明这个平台的功能，具体的功能说明你可以参考 #file:../../docs/requirements.md 。首页的目的就是引导用户登录，之后跳转到登录界面，login界面目前只支持邮箱登录,目前暂不支持注册。

【接口实现】只有登录过的用户才能够进入
homepage和login不应显示网站的导航栏
homepage希望能够添加

页面之间的切换动效，尤其是从homepage到login和login到chat页面的的页面之间的切换动画
#fetch https://mui.com/material-ui/transitions/
也可以使用motion来添加动效。

对于已经登录过的用户，默认直接进入chat界面或eval界面，具体界面要根据上一次退出时的界面

对话回复，历史记录，自定义数据集的添加