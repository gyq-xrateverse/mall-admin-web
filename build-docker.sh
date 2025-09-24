#!/bin/bash

# Mall-Admin-Web Docker 构建脚本

set -e

# 配置变量
REGISTRY="crpi-4z4v1n5g8hbg9g3x.cn-hangzhou.personal.cr.aliyuncs.com"
IMAGE_NAME="$REGISTRY/beilv-agent/mall-admin-web"
VERSION=${1:-"latest"}

echo "=== Mall-Admin-Web Docker 构建脚本 ==="
echo "镜像仓库: $REGISTRY"
echo "镜像名称: $IMAGE_NAME"
echo "版本标签: $VERSION"
echo "========================================"

# 检查Docker是否可用
if ! command -v docker &> /dev/null; then
    echo "❌ Docker 未安装或不可用"
    exit 1
fi

# 检查当前目录是否包含Dockerfile
if [ ! -f "Dockerfile" ]; then
    echo "❌ 未找到 Dockerfile，请确保在正确的目录下运行脚本"
    exit 1
fi

# 构建镜像
echo "🔨 开始构建 Docker 镜像..."
docker build -t $IMAGE_NAME:$VERSION .

if [ $? -eq 0 ]; then
    echo "✅ 镜像构建成功: $IMAGE_NAME:$VERSION"
else
    echo "❌ 镜像构建失败"
    exit 1
fi

# 同时标记为latest（如果版本不是latest）
if [ "$VERSION" != "latest" ]; then
    docker tag $IMAGE_NAME:$VERSION $IMAGE_NAME:latest
    echo "✅ 已标记为 latest: $IMAGE_NAME:latest"
fi

echo "🐳 本地镜像列表:"
docker images | grep mall-admin-web

echo ""
echo "📋 下一步操作："
echo "1. 登录阿里云镜像仓库："
echo "   docker login --username=nick8409546819 $REGISTRY"
echo ""
echo "2. 推送镜像到仓库："
echo "   docker push $IMAGE_NAME:$VERSION"
if [ "$VERSION" != "latest" ]; then
    echo "   docker push $IMAGE_NAME:latest"
fi
echo ""
echo "3. 运行容器测试："
echo "   docker run -d -p 8091:80 --name mall-admin-web-test $IMAGE_NAME:$VERSION"
echo ""
echo "4. 查看容器日志："
echo "   docker logs -f mall-admin-web-test"

echo ""
echo "🎉 构建完成!"