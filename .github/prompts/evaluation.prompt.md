#codebase
请你先结合 services 目录中的rag/prompt eval中需要向后端提供的参数，确定 CreationFlow.tsx 对于 rag 和 prompt评估的步骤和数据格式应当如何设计和保存获取。

页面整体设计如下：点击新建按钮之后进入“创建步骤”，右侧显示每一步具体的需要用户提供的内容，左侧显示详情信息面板，用于展示对于此次evaluation汇总之后的字段。在填写过程中左侧的面板中的内容逐渐从空缺到完满，在这个过程中没有填写的字段样式类似于 mui中的skeleton，用于表示当前字段没有填写。
任务创建完成之后，进入相应的总览界面（只显示rag/prompt评估的结果），这个界面中的以卡片的形式平铺整个界面，当点击已完成（还有其他状态，比如失败、正在进行、正在创建）之后该界面缩小到界面宽度的一半，占据页面的左侧，同时页面右侧显示详情页面，显示该task的历次eval的结果，同时支持在该页面上进一步发送 eval的请求, 还要支持使用mui或echats来展示历次的评分变化趋势。

所以页面类型总共有：eval首页，rag评估的创建面板，rag的总览面板，prompt评估的创建面板，prompt的总览面板。prompt/rag的详情页面。

我的想法如下：
对于rag评估，正式开始之前，在点击 EvaluationSection.tsx 中第95-110行之后 使用 createTask 获取 task_id，因为新建立的 task没有名称，所以必须要让用户命名。第一步，基本信息的填写，命名，选择评估类型（single/multi/custom)和评估指标，点击了下一步之后就可以向后端先后发起 createTask 和 updateTask ，同时保存指标和评估类型留作第二步使用。在第二步中，需要用户上传用于评估的数据集，需要在前端进行格式校验（具体格式请参看 createEvaluation  ），同时左面板需要开辟出来一块的区域，用于展示上传文件的内容。当用户确定可以提交之后，像后端发送请求。之后一段时间自动跳转到 rag eval 总览的page页面，（这个页面的url地址需要你自行设计，同时对于 evaluation statuscard，也需要跳转到这个地方)。跳转完成之后，一直进行 pollEvaluationStatus ，如果没有返回的结果，一直显示 mui 的skeleton。

对于 prompt评估，它的界面没有rag的复杂，使用最简单的方式即可。在点击创建按钮之后打开创建界面，用户填写此次评估的名称和需要用于评估的prompt。点击发送按钮之后，先向后端发送请求创建任务，之后跳转到prompt评估的总览界面。再通过 getAllTasks 来获取最后一个taskid，这么做的原因是 createTask 没有返回值。并等待 createEvaluation 。成功之后点击进入该 task的详情页面，展示详细信息和图标，并支持更多轮的eval评估。

总之，对于rag和promt，创建时只允许创建一个task,而该task结束之后允许进入详情页面继续进行多轮eval。当浏览器关闭或tab关闭时提醒用户：若关闭则失去所有的rag/prompt task。同意之后向后端发送 delete task的请求（这些taskid可能需要通过后端重新获取，如果你没有使用react query，再依次发送），也就是说离开之后这些数据不再保存。

补充，如果不再需要某文件，请重命名文件为 end-...