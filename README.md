# 页面重构库

Japanese electricity supplier website page build

## 项目介绍

本项目目标是为方便所有页面重构工作者进行页面重构。技术栈node+gulp（自动化构建工具）+jade（预编译html）+sass（预编译css）。

##规范

### 页面结构规范

在jade中把页面分为

* header（页头）
* nav（导航）
* banner（横幅）
* button（按钮）
* input（表单输入）
* paging（分页）
* pop（弹窗）
* tab（标签页）
* sidebar（侧边栏）
* widget（窗口控件）

### jade注意事项

1. jade对于缩进要求极其严格，如空格形式的缩进与tab形式的缩进不能共存于一个文件中，否则编译会失效，又如jade在定义多行变量时，需要这样定义：
	
	// 注意"-"后面不能有空格！
	-
		var obj = {
			name:"Rufer",
			sex:"male",
			age:22
		};
