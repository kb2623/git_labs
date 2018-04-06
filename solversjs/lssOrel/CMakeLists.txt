cmake_minimum_required(VERSION 2.8)

project(lssOrel)

file(GLOB lssOrel_SRC
    "*.h"
    "*.cpp"
)

add_definitions(-DVERSION=1)
add_definitions(-DNAME="lssOrel")

set(CMAKE_CXX_FLAGS "-Wall -Wextra")
set(CMAKE_CXX_FLAGS_DEBUG "-g")
set(CMAKE_CXX_FLAGS_RELEASE "-O3")

add_executable(lssOrel ${lssOrel_SRC})
