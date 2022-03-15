#!/bin/bash
file_name = "Quasar-IM-frontend"
docker_name = "im-nginx"

echo '开始部署'
cd /root

if [ -d "/root/"$file_name ]
then
    echo $file_name'文件夹存在'
    # shellcheck disable=SC2164
    cd /root/$file_name
    echo '1.正在停止容器'
    docker-compose down
    echo '2.删除代码目录'
    rm -rf /root/$file_name
    echo '删除代码目录+停止容器 success'
    sleep 1
else
    echo '文件夹不存在'
    # shellcheck disable=SC2046
    docker stop $(docker ps -a  |grep $docker_name | awk -F " " '{print $1}')
    # shellcheck disable=SC2046
    docker rm $(docker ps -a  |grep $docker_name | awk -F " " '{print $1}')
    # docker network rm geosphere-network-web
    rm -rf /root/$file_name
    echo '手动停止删除容器成功'
fi


echo '删除已废弃的 images'
  docker stop $(docker ps -a  |grep $docker_name | awk -F " " '{print $1}')
  docker rm $(docker ps -a  |grep $docker_name | awk -F " " '{print $1}')
  docker rmi $(docker images  |grep none | awk -F " " '{print $3}')
  docker rmi $(docker images  |grep none | awk -F " " '{print $3}')


cd /home/kzzk
git clone git@github.com:Awadabang/Quasar-IM-frontend.git
# shellcheck disable=SC2164
cd  /root/$file_name
git checkout dev
echo '==============git clone success================'
sleep 1

docker-compose build
docker-compose up -d

echo '==============run success================'