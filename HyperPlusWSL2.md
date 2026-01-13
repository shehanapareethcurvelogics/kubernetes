# Understanding Hyper-V and WSL (Beginner Reference)

This document explains Hyper-V and WSL (Windows Subsystem for Linux) in a simple and clear way. It is written for beginners and can be used as a future reference.

## 1. What is Hyper-V?

Hyper-V is Microsoft's hypervisor. A hypervisor is a special software layer that makes it possible to create and run virtual machines (VMs).

Hyper-V sits between the physical hardware (CPU, memory, disk, network) and operating systems. It directly talks to the hardware and shares those resources safely among multiple operating systems.

**In simple words:**
Hyper-V allows one physical computer to behave like multiple computers by creating virtual machines.

## 2. Where Hyper-V Sits in the System

Hyper-V runs very close to the hardware and starts when the system boots.

**Structure:**
```
Hardware → Hyper-V → Operating Systems (Windows, Linux VMs)
```

## 3. What is WSL (Windows Subsystem for Linux)?

WSL stands for Windows Subsystem for Linux. It is a Windows feature that allows you to run Linux environments directly on Windows.

## 4. What is WSL2?

WSL2 is the modern version of WSL. WSL2 uses Hyper-V to create and manage Linux virtual machines.

**Important clarification:**
WSL itself is not a virtual machine. WSL2 is a manager that creates and manages Linux virtual machines.

## 5. Role of WSL2

WSL2 acts as a specialized manager that:
- Creates Linux virtual machines
- Runs a real Linux kernel
- Manages Linux filesystems and processes
- Uses Hyper-V for hardware virtualization

## 6. Relationship Between Hyper-V and WSL2

Hyper-V provides the virtualization capability by talking to the hardware. WSL2 uses Hyper-V to create and manage Linux virtual machines.

**Clear relationship:**
```
Hardware → Hyper-V → Windows → WSL2 → Linux Virtual Machine
```

## 7. Key Takeaways

- Hyper-V is the foundation that enables virtual machines on Windows.
- WSL2 is built on top of Hyper-V.
- WSL2 only creates and manages Linux virtual machines.
- Hyper-V talks directly to hardware; WSL2 manages Linux environments.

