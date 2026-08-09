## 1. 二进制，十进制，十六进制 B/D/H
### 转化


###### 无脑方法--除法
就像十进制中取各位数字的方法一样，每次/10的余数就是个位数，舍去余数的商接着/10

*二进制就是把10换成2*



- /2余数为当前个位
- 不断/2直到为0


几进制就是/几



###### 降幂法
找比当前数小的各级幂中最大的, 放入对应位置



### 运算
10进制怎么算，+-x/就怎么算，只是换成几位数几进制的问题



### 计算机中的表示--补码表示法
正数补码即原码

负数补码为*对应正数取反+1*



***十进制怎么算负数补码***

$2^{n(表示位数)}-x(原码)$



表示范围一般是负数比正数多一个, 加上0刚好是$2^n$个



###### 优点？
- 加减运算统一
- 符号位参与运算
- 0的表示唯一


## 2. 80x86计算机组织
![img](../../imgs/asm/asm汇编语言 notes_0.png)
***answer***

1. 软件和硬件
2. 运算器&控制器&寄存器
	1. ALU: 算术和逻辑运算指令
	2. CU：全机的控制工作
3. 8, 16
4. 16个字节一个小段，段地址必须从一个小段的首地址开始(即最低位必然是0)
5.
	- 一个字节占一个存储单元。


	- 一个字（16 位）存储在连续的两个字节中，**低位字节在低地址，高位字节在高地址**（小端模式）。
6. 8086存取数据是以字为单位进行的，要求以偶地址访问存储器，所以奇地址访问存储器需要访问两次
7. **20位地址总线：00000H-FFFFFH**
8. 段基地址（段起始地址）x16 + 偏移地址（有效地址）
9. data, code, extra, stack; 每段的可寻址空间为$2^{16}$bytes=64K
10. (11)




### 寄存器
分为 *程序可见寄存器* 与 *程序不可见寄存器*



*程序可见寄存器* 可分为：（有交叉）

1. 通用寄存器: 存放数据，也有专门用途
	1. AX：累加器，乘除放操作数，I/O指令使用其与外设交换信息
	2. BX: 基址寻址器，默认与DS配合
	3. CX: 循环计数器，移位操作计数器(cl), **串处理指令**
	4. DX: 双字长运算存放高位字，I/O存放端口地址
	5. SP: stack pointer
	6. BP: base pointer，地址/数据偏移量，默认与SS配合
	7. SI: source index, 地址/数据偏移量，默认与DS配合，串指令中源串偏移地址
	8. DI: destinaiton index, 寻址与DS，串指令与ES，目标串偏移地址
2. 专用寄存器
	1. SP:
	2. IP: 始终指向下一条即将开始执行的指令首地址, 与CS配合
	3. FLAGS: psw, program status register,  [[asm汇编语言 notes#2. 80x86计算机组织#寄存器#FLAGS]]
		1. 状态（条件）标志
			1. OF
			2. SF
			3. ZF
			4. AF
			5. CF
			6. PF
		2. 控制标志/系统标志
			   1. DF
			   2. IF: Interupte Flag
			   3. TF: trap flag
3. 段寄存器
	1. CS
	2. SS
	3. DS
	4. ES
![img](../../imgs/asm/asm汇编语言 notes_1.png)
![img](../../imgs/asm/asm汇编语言 notes_2.png)


#### FLAGS
#### 条件码（状态）标志


| 位   | 名称     | 英文缩写                 | 置1（为1）的条件 | 名字由来说明                       | 含义                  |
| --- | ------ | -------------------- | --------- | ---------------------------- | ------------------- |
| 0   | 进位标志   | Carry Flag           | CF        | 运算结果产生进位（加法）或借位（减法），即超出数据最大位 | 代表运算中产生了进位（Carry）   |
| 2   | 奇偶标志   | Parity Flag          | PF        | 结果操作数中1(binary)的个数           | 代表结果字节的Parity（奇偶性）  |
| 4   | 辅助进位标志 | Auxiliary Carry Flag | AF        | 低半字节产生进位/借位（如第3位到第4位）        | 辅助(half)进位，供BCD运算判断 |
| 6   | 零标志    | Zero Flag            | ZF        | 运算结果为0时置1                    | 结果等于Zero（零）时置位      |
| 7   | 符号标志   | Sign Flag            | SF        | 结果最高位（D7）为1时（即负数）            | 结果的Sign bit（符号位）    |
| 8   | 溢出标志   | Overflow Flag        | OF        | 有符号运算结果溢出，超出了能够表达的范围         | 有符号运算Overflow（溢出）   |


###### 详细说明（置1条件+名字由来）


1. **进位标志（CF, Carry Flag）**
   - **置1条件**：当进行无符号加法/减法运算后，结果产生了进位（加法）或借位（减法）（即超出了目标操作数的位宽，超出最低位，比如8位加法结果在第9位有进位）。
   - **名字由来**：Carry，意为“进位”，用于指出无符号数运算时进位（或借位）发生。*就是(例如对于单字节寄存器al,bl)从无符号数的角度看，相加加超过255(98H+98H)*
   - **dos**: NC(not carry)->CY(carry)


2. **溢出标志（OF, Overflow Flag）**
   - **置1条件**：有符号数加法/减法运算时，结果超出了可表示范围（比如两个正数相加得负数，或两个负数相加得正数）。
   - **名字由来**：Overflow，意为“溢出”，表示有符号数运算时结果溢出。*例如对于单字节寄存器 al, bl: 123D+123D>127D*
   - **doc**: NO->OV


> CF，OF的区别就在于看待的视角，从无符号的视角看范围就是0-255, 而从有符号的视角看就需要求补码，CF&OF可以单个发生也可以同时发生，相互独立


3. **奇偶标志（PF, Parity Flag）**
   - **置1条件**：结果的最低8位（一个字节）中“1”的个数为偶数时PF为1，为奇数时为0。
   - **名字由来**：Parity，意为“奇偶性”，用来判断结果中的“1”数的奇偶性。
   - **dos**: PO->PE


4. **辅助进位标志（AF, Auxiliary Carry Flag）**
   - **置1条件**：在低4位（半字节）相加/减时从第3位(D3)向第4位(D4)产生了进位（加）或借位（减）。常用于BCD（十进制）运算。
   - **名字由来**：Auxiliary Carry，含义为“辅助进位”，用于辅助十进制调整。


5. **零标志（ZF, Zero Flag）**
   - **置1条件**：运算结果为0。
   - **名字由来**：Zero，指结果是否为零。
   - **dos**: NZ->ZO


6. **符号标志（SF, Sign Flag）**
   - **置1条件**：结果的最高位（即8位的D7或16位的D15）为1（即结果为负数，补码）。
   - **名字由来**：Sign，参数名即为“符号”，表明结果正负。
   - **dos**: PL(positive)->NG(negative)


##### 控制标志
- DF: 0正向
##### 系统标志
- IF
- TF
### 寻址
#### 实模式
永远都只使用20位地址总线



#### 保护模式
偏移地址为32位长，最大段长：$2^{32}=4\times 2^{30}=4G$

寻址方式为：

段寄存器

-> ~~段基地址~~ 选择器（16 bit, XXXXH),

	`[-13:]即后13位`为`描述符在描述符表中的偏移地址`,

	`[-14]即第3位`为`描述符表类型(3种,局部/全局/中断)`,

	`[-15:-16]即前两位`为`请求访问特权级`

-> `LDTR/GDTR/IDTR`三种*程序不可见寄存器*分别记录三种描述符表的起始地址

-> 描述符(一个描述符表有$2^{13}$个描述符,一个8 Byte(64bit), 所以一个描述符表大小为$2^{13}\times 2^{3}=2^{16}$ Byte, also 64K)

-> 描述符中记录了`段基地址(80286->24 bit, 80386-> 32 bit)`, `段大小(16/20)`, `访问权字节(1 byte)`

	对于80386: 还有`颗粒度G(0->byte, 1->page(4KB)`, `D`, `AVL`

![img](../../imgs/asm/asm汇编语言 notes_3.png)
![img](../../imgs/asm/asm汇编语言 notes_4.png)
![img](../../imgs/asm/asm汇编语言 notes_5.png)
![img](../../imgs/asm/asm汇编语言 notes_6.png)
![img](../../imgs/asm/asm汇编语言 notes_7.png)
### 外部设备
三种寄存器

![img](../../imgs/asm/asm汇编语言 notes_8.png)
- 有时候,简单设备会将 *状态寄存器*和*命令寄存器*合并为*控制寄存器*
- 每个寄存器给一个端口号port
- I/O地址总线是16位, I/O地址空间为64K, 端口地址范围为`0000H-FFFFH`


#### BIOS/DOS
> BIOS: basic input/output system
> DOS: disk operating system


BIOS更接近底层硬件,在只读存储器ROM中



DOS在开机时从磁盘装入存储器,更高级,可以调用若干次BIOS



需要使用外设时的选择顺序: DOS->BIOS->自己编程序

### 内存分段管理的好处:
![img](../../imgs/asm/asm汇编语言 notes_9.png)
## 3. 指令系统
![img](../../imgs/asm/asm汇编语言 notes_10.png)




1. *背*
![img](../../imgs/asm/asm汇编语言 notes_11.png)


#### 寻址方式


##### 数据相关
> **Warning**: 当使用寄存器间接寻址的时候使用了BP, 则约定段默认为`SS`而非`DS`了
	其他情况则缺省值均为DS

###### 16 bit: 8086/80286
![img](../../imgs/asm/asm汇编语言 notes_12.png)
- 直接寻址:`mov ax, val`: **注意，[100h]是汇编后的表示，应该使用符号地址,[100h]/ds:[100]会被认为是立即数**
- 寄存器间接寻址:`mov ax, [bx]`
- `mov as, 100H[bx]`
- `mov ax, [bx][si]` / `mov ax, [bx+si]` **不能同时使用bx&bp/si&di**
- `mov ax, 100H[bx][si]` / `mov ax, [100H+bx+si]`
100H**应该**用符号变量表示



*记记名字*

![img](../../imgs/asm/asm汇编语言 notes_13.png)


###### 32 bit: 80386及以后
新增

- `mov eax, 100H[esi*8]`
- `mov ecx, [eax][edx*8]`
- `mov eax, 100H[ebp][edi*4]` / `mov eax, [ebp+edi*4+100H]`


> ???: 按照gpt所说,`[bx+si+offset]`这样的方式书写先后顺序是有讲究的,是真的吗


##### 转移地址相关
- 段内
	- 直接寻址: 跳到`rip+addr`, 所以给的是偏移量, addr是目标地址与当前rip的差值, **但是addr仅存在于机器码中，汇编后的程序中写的还是目标的有效地址，汇编源程序则必须写符号地址**
		- `jmp near ptr func_label`: 16位位移量
		- `jmp short label`: 8位位移量
	- 间接寻址: 直接跳到给定的有效地址处(来源于一个寄存器/存储单元)
		- `jmp bx`
		- `jmp word ptr 100H[bx]`: 可以使用除了立即数以外的任何一种数据寻址方法,且缺省段基地址也为DS
- 段间
	- 直接寻址: `jmp far ptr func_label` 直接跳到func_label函数处, 也可以用CS':SP', **经实验，段内直接跳转写far ptr好像也没毛病**
	- 间接寻址:
![img](../../imgs/asm/asm汇编语言 notes_14.png)




> **Warning**: 条件跳转只能用*段内直接寻址*, `call`, `jmp`可以用四种


### 机器语言指令概况
#### 操作码的机器语言表示
![img](../../imgs/asm/asm汇编语言 notes_15.png)
![img](../../imgs/asm/asm汇编语言 notes_16.png)


#### 指令执行时间
![img](../../imgs/asm/asm汇编语言 notes_17.png)


### 指令大全


![img](../../imgs/asm/asm汇编语言 notes_18.png)
#### 自查
![img](../../imgs/asm/asm汇编语言 notes_19.png)
![img](../../imgs/asm/asm汇编语言 notes_20.png)
#### 数据传送
- *注意传送的限制*
- `push/pop`不允许立即数操作，可以reg/mem/segreg
- `pushf/popf`: 专门用来保存FLAGS
- *movsx, movzx*方便实现对有/无符号数的扩展
- *pusha,pusad,popa,popad*: 80286/80386
![img](../../imgs/asm/asm汇编语言 notes_21.png)
- `I/O`: 前256端口可直接指定,之后先给DX
- `xlat` / `xlat opr`: bx->table, ax->value
- `lea/lds/les/lss/lfs/lgs reg, src`: src为存储器寻址, reg不能是段寄存器, *传送有效地址而非取地址中的值*
...

**均不影响FLAGS**

#### 算数
##### **加减**
- `add`: 操作数限定同 `mov`
- `adc`: add with carry
- `xadd`: xchg & add
- `inc`: *不影响 CF*
- `sub`: 要求同 `add`
- `sbb`:
- `dec`: 不影响 CF
- `neg opr`: 返回补码
- `cmp`: 只改变标志位，不改变src & des
	- `cmpxchg`: 比较并交换 (486:)
	- `cmpxchg8b`: 比较并交换8字节(Pentium:)
> 减法如何影响标志位CF/OF:


##### BCD码调整
- 压缩BCD码：4位2进制数->表示一位十进制数 (daa(decimal adjust for addition), das) `例如 63H`
- 非压缩BCD码：8位2进制数->表示一位十进制数(高四位没有意义) (aaa(ascii adjust for addition), aas, aam aad) `例如 0603H`
**实际上都是一个16进制数表示一个十进制数，只是a-f被抛弃了，想要实现$6H+7H=13H$



**用法:** 半个字节半个字节运算，非低半字节则需要带CF, 每次算完加一个调整指令即可（和/差/积 需要放在AX中）



> 对于小-大的情况，会得到十进制补码




##### **乘法**
```asm
mul src
```
- `src`为除立即数以外的寻址方式
- `dst`只能是al,ax
- `mul`: 无符号
- `imul`: 有符号
- al->ax, ax->dx:ax, *由src隐含的类型决定, db/dw也算*


只有CF/OF的变化有意义，取决于操作数是字节/字，由结果的高一半决定（即乘后结果是否还在原来的表示范围内）

![img](../../imgs/asm/asm汇编语言 notes_22.png)
> **Warning**: 操作数为*除立即数以外的寻址方式*


![img](../../imgs/asm/asm汇编语言 notes_23.png)
##### **除法** -> **对于所有条件码无定义**


`无符号除法：div`

```asm
div src(div reg/mem) ; ax/src
```
- ax / (1 byte reg/mem)->al...ah    dx:ax / (2 byte reg/mem) ->ax......dx    edx:eax->eax......edx


`带符号除法idiv`: 使用同div, 但是注意：**进行32位除以16位时，需要保证dx里的符号正确，cwd可对dx进行ax的符号拓展**



#### 逻辑运算
####### **逻辑计算**

![img](../../imgs/asm/asm汇编语言 notes_24.png)
####### **移位指令**

![img](../../imgs/asm/asm汇编语言 notes_25.png)
> **Warning**: dst不可为段寄存器/立即数


![img](../../imgs/asm/asm汇编语言 notes_26.png)
**RCL/RCR**: 带进位的循环移位指令，补齐的是CF原来的值，而不带进位的是将最后移出的值同时补齐和赋给CF



####### **移位指令对于FLAGS的影响**

- CF: 都有影响，看移出去的是0/1
- OF: 取决于cnt=1, 都有影响，看最高有效位是否改变
- PF/ZF/SF: 非循环移位有影响
- AF: 无定义


386及以后有*位测试，位扫描, 双精度移位操作*

![img](../../imgs/asm/asm汇编语言 notes_27.png)
![img](../../imgs/asm/asm汇编语言 notes_28.png)


#### 串处理指令
- 隐含寻址模式，不能更改，只能用es:di,ds:si
- 内存&内存，内存&寄存器, 内存&外设：分别用不同的指令，固定的寄存器
- `cmps`/`scas`: (ds:si)/ax-(es:di)
- 重复前缀：`rep`/`repe,repz,repnz,repne`，cx/ecx计数
**Warning**: repcc因条件不满足而跳出时，di所指向的是不满足条件所在位的下一位, *操作顺序：判断 -> `cx--` -> scas(包含`di++`) -> 判断*

#### 控制转移指令
jmp见前面，**条件跳转只能用段内直接短转移（8位偏移地址/函数标签）**



##### 条件跳转
- 根据FLAGS(=1时)跳转：`jz,js,jo,jp,jc`(不包含对于AF的结果跳转), =0则 `jnz jns jno...`
> jz=je
> jp=jpe, jnp=jpo=jnae
> jc=jb, jnc=jnb=jae


- 比较跳转：无符号数ab, 有符号数gl, *jl=jnge*
- cx跳转：jcxz->cx=0跳转
**386及以后有条件设置指令**



##### 循环指令
循环指令对cx的操作不影响FLAGS

![img](../../imgs/asm/asm汇编语言 notes_29.png)


##### 子程序调用/返回指令
- 调用： `call dst`, 需要手动将子程序需要的数据入栈等, `dst`可以是函数标签/reg/mem
> `call bx`->跳到bx中所存地址处
   `call [bx]` -> 跳到bx所存内存地址处所存的内存地址去

> **???**: 不过这种情况怎么区分近远跳转呢
- 返回：`ret`/`ret expression`
	`ret`: 普通的返回，修改IP,SP

	`ret expression`: 带立即数的返回，返回后将堆栈指针加上expression表达式的立即数结果（可以用来将为子程序压入的参数出栈）【例如有n个字型参数，则为2n】



##### 中断指令
![img](../../imgs/asm/asm汇编语言 notes_30.png)


#### 处理机控制指令
![img](../../imgs/asm/asm汇编语言 notes_31.png)
![img](../../imgs/asm/asm汇编语言 notes_32.png)
还有一些，但是ppt上只有这几个



## 4. 汇编语言程序格式
- 汇编指令包括：**机器指令，伪指令，宏指令**
### 伪指令
#### 处理器选择
#### 段定义
- `xxx segment ... xxx ends`,
	- `s_name segment [align_type] [combine_type] [use_type] ['class']`
![img](../../imgs/asm/asm汇编语言 notes_33.png)
![img](../../imgs/asm/asm汇编语言 notes_34.png)
![img](../../imgs/asm/asm汇编语言 notes_35.png)
- `assume xxx:xxx/nothing`: 不对段寄存器赋值，仅为了让汇编程序理解
- 新版：`model`/`简化的段定义伪操作`
	- model:
![img](../../imgs/asm/asm汇编语言 notes_36.png)
![img](../../imgs/asm/asm汇编语言 notes_37.png)
	- 简化的段定义操作
![img](../../imgs/asm/asm汇编语言 notes_38.png)
		- 与简化段定义有关的预定义符号
![img](../../imgs/asm/asm汇编语言 notes_39.png)
![img](../../imgs/asm/asm汇编语言 notes_40.png)
#### 程序命名和结束伪操作
- `name`
- `title`
- `end [label]`


#### 数据定义伪操作
`[var_name]   Mnemonic    operand,...,operand    [;comment]`



也可以

```
var_name dw xxx
		 dw xxx
		 dw xxx
```


**var_name**

这一符号（变量）的值为其第一个操作数的第一个字节相对于其所在段的偏移地址，并暗含其类型参数，即

`mov al,var_name`时会报错，(al->byte, var_name->word)

--> 可以 `mov al, byte ptr var_name`





`varname/comment`可选



**dup**

`duplicate_times dup(operand,...,operand)`



*可嵌套*, `100 dup(0,2 dup(1,2),0,3)`



#### 表达式赋值伪操作
> 本质上只是类似C中#define的文本替换
- `equ`: 表达式中的变量是值而非地址
- `=`: 与equ的区别在于可以重复定义：`k=k+5`


#### 地址计数器和对准伪操作
- `$`: 在data segment中，表示所在的这个operand的首地址，在code segment（机器指令）中，表示所在指令的首地址
- `org(n)`:
```asm
data segment
	buffer label byte
	org $+8
```
预留8字节未定义缓冲区，相当于

```
data segment
	buffer db 8 dup(?)
```
**事实上，有没有这个buffer label byte都无所谓，不分配实际空间，只是起一个标记地址的作用**



- `even`
- `align boundary(2^n)`: `align 2=even`,


#### 控制基数的命令
`radix 16`: 将默认数制（基数）改为16

> asm源程序中，默认数制（基数）为10


### 汇编语言指令格式
- `offset val1 - offset val2`可行，得到地址之差（可为负数），但是 `offset val1 + offset val2`不可行，会报错 `operand must match`
#### 变量/标号 隐藏属性
- 标号：
	- 段地址
	- 偏移地址
	- 类型: near/far(-1/-2)
- 变量
	- 段地址
	- 偏移地址
	- 类型：db,dw,dd,dq
#### 表达式
*定义*：常数/寄存器/标号/变量 + **操作符**

##### 操作符
![img](../../imgs/asm/asm汇编语言 notes_41.png)
![img](../../imgs/asm/asm汇编语言 notes_42.png)
![img](../../imgs/asm/asm汇编语言 notes_43.png)
![img](../../imgs/asm/asm汇编语言 notes_44.png)
![img](../../imgs/asm/asm汇编语言 notes_45.png)
**this**

相当于对于同一个内存地址，起一个不同类型的别名

```asm
; 一种用法, 数据段中给word类型变量起一个byte类型的别名，需要哪个类型用哪个名字
val1 equ this byte
val2 dw 100 dup(?)

;第二种用法，也可以给标签起别名，当段间跳转时用jmp jmp_far, 段间用jmp jmp_near
jmp_far equ this far
jmp_near:
	mov ax,1
```
**但是需注意，jmp jmp_far必须要出现在jmp_far定义之后，否则须写明类型： jmp far ptr jmp_far（见后面的汇编上机部分）**



### 汇编语言程序的上机过程
- 准备汇编上机环境（masm/tasm)
- 编写汇编源程序
![img](../../imgs/asm/asm汇编语言 notes_46.png)
![img](../../imgs/asm/asm汇编语言 notes_47.png)
![img](../../imgs/asm/asm汇编语言 notes_48.png)
![img](../../imgs/asm/asm汇编语言 notes_49.png)
![img](../../imgs/asm/asm汇编语言 notes_50.png)
#### DOS装入.exe文件过程
1. PSP(256 bytes)
2. file header
3. excutable module size
4. segment address
5. relocation
6. segment register
7. 控制权->.exe
> 所以可以看到，初始状态下cs指向程序开头，ss指向用户的内容开头（紧跟psp)，而ds是指向psp段基地址的
##### 返回dos
###### 1
```asm
main proc far
	assume ...
	push ds
	xor ax,ax
	push ax
	...
	ret
```
###### 2
```asm
mov ax,4c00
int 21h
```
ah=4c --> 功能号, al=00 --> 返回码



## 5. 循环与分支程序
![img](../../imgs/asm/asm汇编语言 notes_51.png)
### 循环
![img](../../imgs/asm/asm汇编语言 notes_52.png)
**实验：打印bx的十六进制形式**

> ah=2->按照ascii码打印dl


**循环未必要用cx，尤其是循环体中需要使用cx（例如循环移位cnt）的时候**

![img](../../imgs/asm/asm汇编语言 notes_53.png)
### 分支
**两种方法，条件跳转/跳跃表**



#### 跳跃表
```asm
data segment
    cond dw 111000100b
    jump_table dw offset func1
         dw offset func2
         dw offset func3
         dw offset func4
data ends
code segment
    assume ds:data,cs:code
start:
    mov ax,data
    mov ds,ax
    mov ax,cond
    mov cx,4
    lea bx,jump_table
    jmp loop_start
exit:
    mov ax,4c00h
    int 21h
loop_start:
    shr ax,1
    jb found
    add bx,type jump_table
    loop loop_start
found:
    call [bx]
    jmp exit
func1:
    mov ax,1
    ret
func2:
    mov ax,2
    ret
func3:
    mov ax,3
    ret
func4:
    mov ax,4
    ret
code ends
end start
```


## 6. 子程序结构
![img](../../imgs/asm/asm汇编语言 notes_54.png)


### proc
对于 `xxx proc far/near` *且* 定义更早，可以call直接调用ret返回，编译器自会确定类型



near类型永远不用多写



对于只有label而没有定义proc far/near, 需要 `call far ptr + retf`



#### 传送参数的方法：
- 通过寄存器传送参数
- 通过存储器传送参数 (同一模块直接使用即可)
- 通过地址表（储存参数地址的表）
- 通过堆栈


### struc
```
mystruc struc
	val1 db ?
	val2 dw 2
	val3 dw ?
mystruc ends
```


**不分配内存，此时只是定义**



而 `name mystruc <>/name mystruc <1,,1>`会分配内存，相当于

相当于

```asm
name.val1 db ?
name.val2 dw 2
name.val3 dw ?
```
或者

```asm
name.val1 db 1
name.val2 dw 2
name.val3 dw 1
```
**可以自由进行初始化，也可以覆盖struc定义中的默认初值**

![img](../../imgs/asm/asm汇编语言 notes_55.png)
**这里的struc比较宽松，每一个地址表达式都可以作为struc_name, .xxx就是将地址表达式的地址作为开头时其对应成员的偏移地址**, 如下

```asm
stu struc
	val1 dw ?
	val2 dw ?
	val3 dw ?
stu ends

data segment
	head dw 1
	tail dw 5
data ends

code segment
	mov ax,head.val2 ; 会得到ax=5
code ends
```
**栈中数据也能用，按照定义的反序push进栈**



### DOS系统功能调用
#### 1/2/7/8 输入单个字符
- `01: 输入单个字符(al)并回显（不按回车）`
- `02: 输出单个字符(dl)`
- `07/08: 输入单个字符无回显，8可以检测ctrl-break/ctrl-c?`
#### 9：打印字符串
ds:dx=串地址，以$结尾



#### 0Ah：输入字符串
ds:dx为缓冲区首地址

(ds:dx)为缓冲区最大字符数

-->

(ds:dx+1)为实际输入字符数

输入的字符串从(ds:dx+2)开始



## 7. 高级汇编语言技巧
![img](../../imgs/asm/asm汇编语言 notes_56.png)


### 宏指令
**必须先定义再使用**



```asm
macro_name macro param1 param2
	local sym1,sym2
endm
```


和C的宏类似，只是文本的替换

![img](../../imgs/asm/asm汇编语言 notes_57.png)
![img](../../imgs/asm/asm汇编语言 notes_58.png)
- 没有local定义的标号会被当作宏定义之外的标号
- `purge macro_name` 可以删除宏定义
- 当宏指令名与已有标号/变量/指令助记符冲突时，宏优先
#### 宏操作符
#####  & 合并符号


#####  ;; 不会展开的注释
#####  % 表达式展开
![img](../../imgs/asm/asm汇编语言 notes_59.png)
##### :req 必须的哑元
#####  :=哑元缺省值


#### 宏定义嵌套
**1. 宏定义中有宏调用**



**2. 宏定义中有宏定义**

![img](../../imgs/asm/asm汇编语言 notes_60.png)


#### 列表伪指令
**只影响lst文件，不影响目标码的生成**



- .lall  列出所有（包括注释）
- .sall  什么都不列出来
- .xall  默认情况，列出目标代码，不列出注释


**以上各种情况，;;的注释都不会列出来**



#### 宏库
`include xxx.mac`调用宏库



### 重复汇编
#### rept
![img](../../imgs/asm/asm汇编语言 notes_61.png)
#### irp/irpc
![img](../../imgs/asm/asm汇编语言 notes_62.png)
```asm
irp reg <ax,bx,cx,dx>
	push reg
endm
```
汇编后得到

```asm
push ax
push bx
push cx
push dx
```


![img](../../imgs/asm/asm汇编语言 notes_63.png)
![img](../../imgs/asm/asm汇编语言 notes_64.png)


### 条件汇编
![img](../../imgs/asm/asm汇编语言 notes_65.png)
##### example
1. 根据跳转距离自动决定是short/near ptr
```
BRANCH MACRO X
	IF ($-X) LT 128 JMP SHORT X
	ELSE JMP NEAR PTR X
ENDIF
ENDM
```
2. 计算$x\times 2^n$
```
power macro x,n ;调用前需要count=0, x可以为寄存器等【ax】
	shl x,1
	count=count+1
	if count-N
	power x,n
	endif
endm
```
3. 通过递减实现除法
```
divide macro divident,divisor,quotient
	local comp,out
	cnt=0
	ifndef divident
	cnt=1
	endif
	ifndef divisor
	cnt=1
	endif
	ifndef quotient
	cnt=1
	endif
	if cnt
	exitm
	endif ;;筛除参数不全的情况

	push ax
	push bx
	push cx
	mov ax,dividend
	mov bx,divisor
	sub cx,cx
comp:
	cmp ax,bx
	jb out
	sub ax,bx
	inc cx
	jmp comp
out:
	mov quotient,cx
endm
```


|关键字|含义|
|---|---|
|`LT`|小于（<）|
|`LE`|小于等于（≤）|
|`GT`|大于（>）|
|`GE`|大于等于（≥）|
|`EQ`|等于（=）|
|`NE`|不等于（≠）|


### 高级语言结构
#### .if, .while
```
.if
.endif
.while
.endw
```
表达式中可以直接写<, >, >=, <=, == 等

```
.if AL=='A'
.elseif AL=='A'
.else
mov al,'w'
.endif
call disp
```


#### .repeat
```
.repeat
.until
```
或者

```asm
.repeat
.untilcxz [expression]
```
**后面这种当cx == 0或者表达式成立的时候退出循环(这种仅支持表示判断相等/不等的表达式)**



## 8. 输入输出程序设计
![img](../../imgs/asm/asm汇编语言 notes_66.png)
**in/out控制一切设备**



有三种方式：

- 查询方式
- DMA方式
- #important 中断方式


### DMA
![img](../../imgs/asm/asm汇编语言 notes_67.png)
![img](../../imgs/asm/asm汇编语言 notes_68.png)
![img](../../imgs/asm/asm汇编语言 notes_69.png)
![img](../../imgs/asm/asm汇编语言 notes_70.png)


### Example
**发声程序**

![img](../../imgs/asm/asm汇编语言 notes_71.png)
**查询方式打印输出**

![img](../../imgs/asm/asm汇编语言 notes_72.png)


### 中断
![img](../../imgs/asm/asm汇编语言 notes_73.png)
#### 硬件中断（外中断）
##### NMI(Non Markable Interrupt)
- NMI脚引入
- 不受IF标志位影响，终端类型号为2


##### Maskable Interrupt
- INTR脚引入
- 允许中断条件：`IF=1` && `中断屏蔽寄存器对应位=0`
- cpu通过*可编程中断控制器中断控制器(如8259A)* 与外部设备连接
###### 可编程中断控制器
####### 中断屏蔽寄存器IMR 21H

*在实验中，默认值为F8h(11111000)，即开了彩显，键盘，定时器*



*经实验，关掉键盘还真就输入不了了*

![img](../../imgs/asm/asm汇编语言 notes_74.png)
![img](../../imgs/asm/asm汇编语言 notes_75.png)
####### 中断命令寄存器 20H

![img](../../imgs/asm/asm汇编语言 notes_76.png)


####  软件中断(内中断)
![img](../../imgs/asm/asm汇编语言 notes_77.png)


##### 存取中断向量 & 中断向量表
**中断向量地址： $\text{中断类型号}\times 4$**



**256个中断向量，每个占4字节，低字节为IP，高字节为CS，一共占1KB，位于0000:0000-0000:03FFH**

![img](../../imgs/asm/asm汇编语言 notes_78.png)
![img](../../imgs/asm/asm汇编语言 notes_79.png)
#### 中断优先级
![img](../../imgs/asm/asm汇编语言 notes_80.png)
![img](../../imgs/asm/asm汇编语言 notes_81.png)


#### 中断嵌套
系统定时器，每秒中断18.2次，终端类型8，每次中断会调用指令 `int 1ch`



> 一个正在执行的中断程序，在开 **开中断(IF=1)** 的情况下，可以被 **优先级高于它** 的中断源中断，但如果要被同级/更低级的中断源中断，则需要EOI命令，清除正在执行的中断请求


## 9. BIOS & DOS 中断
![img](../../imgs/asm/asm汇编语言 notes_82.png)
### 键盘IO
#### DOS I/O int 21h
##### 输入单个字符
- `01: 输入单个字符(al)并回显（不按回车）`
- `02: 输出单个字符(dl)`
- `06: 读键盘字符， dl=offh，不等待 -> al=字符码，zf=0 /无输入zf=1`:
- `06: dl!=0ffh时，为输出dl中的字符(快速输出，不经过缓冲区)`
- `07/08: 输入单个字符无回显，8可以检测ctrl-break/ctrl-c?`


> btw, 方向键的ascii码
> up: 0048
> down: 0050
> left: 004b
> right: 004d


> 一些ascii码
> 0: 0030
> a: 0061
> A: 0041
> 小键盘数字：`003*（*就是数字)`


##### 9：打印字符串
ds:dx=串地址，以$结尾

##### 0Ah：输入字符串
ds:dx为缓冲区首地址

(ds:dx)为缓冲区最大字符数

-->

(ds:dx+1)为实际输入字符数

输入的字符串从(ds:dx+2)开始



##### 0Bh: 读键盘状态
- `al=offh -> yes`
- `al=00 -> not`


##### 0Ch
清楚键盘缓冲区，调用一种键盘功能

`al=键盘功能号(1/6/7/8/A)`



#### BIOS 键盘中断 int 16h
![img](../../imgs/asm/asm汇编语言 notes_83.png)


### 显示器I/O
![img](../../imgs/asm/asm汇编语言 notes_84.png)


#### BIOS 显示器中断 int 10h
**直接存取显示储存器需要知道显示储存器的起始地址，使用int 10h就可以直接对其进行操作**

![img](../../imgs/asm/asm汇编语言 notes_85.png)


###### exp : print heart
![img](../../imgs/asm/asm汇编语言 notes_86.png)
#### DOS 显示器 I/O


## Q & As


- 什么情况下根据段值和偏移确定的存储单元地址会超出1M？8086/8088如何处理这种情况？
	- 答：   当物理地址的计算超过FFFFFH时，存储单元地址会超出1M，8086/8088将取其1M的模       覆盖存取；
