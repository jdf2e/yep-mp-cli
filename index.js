"use strict";
var inquirer = require("inquirer");
var fs = require("fs");
const spawn = require('cross-spawn');
inquirer
  .prompt([
    {
      type: "checkbox",
      message: "请选择您需要的小程序组件：",
      name: "components",
      choices: [
        {
          name: "dialog"
        },
        {
          name: "avater"
        },
        {
          name: "affix"
        },
        {
          name: "badge"
        }
      ],
      validate: function(answer) {
        if (answer.length < 1) {
          return "请至少选择一个组件添加";
        }
        return true;
      }
    }
  ])
  .then(answers => {
    // console.log(JSON.stringify(answers, null, '  '));
    let components = [];
    answers.components.map(item => {
      components.push('@jdcfe/'+item);
    });
    //判断package.json文件是否存在
    fileExist().then((flag)=>{
      if (flag) {
        console.log('Installing packages. This might take a couple of minutes.');
        let args = [ 
          'install',
          '--save',
          '-dev'
        ].concat(components);
        const child = spawn('npm', args, { stdio: 'inherit' });
        child.on('close', code => {
          if (code !== 0) {
            console.log('很遗憾，组件安装失败，错误码：',code);
          }else{
           console.log('恭喜您，组件安装成功！');
          }
        });
      }
    })
  });
/**
 * 判断package.json文件是否存在
 */
function fileExist() {
  return new Promise((resolve,reject)=>{
    fs.exists("./package.json", function(exists) {
      if (exists) {
        resolve(true);
      }else{
        console.log("package文件不存在");
        resolve(false);
      }
    });
  })
}



