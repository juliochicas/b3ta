#!/usr/bin/env python3
import os, shutil, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIST = os.path.join(ROOT, "dist")
EXCLUDE = {"dist","node_modules",".git","supabase","scripts",".agents",".workspace",".claude","src",".lovable"}
if os.path.exists(DIST): shutil.rmtree(DIST)
os.makedirs(DIST)
for name in os.listdir(ROOT):
    if name in EXCLUDE: continue
    s = os.path.join(ROOT, name); d = os.path.join(DIST, name)
    if os.path.isdir(s): shutil.copytree(s, d)
    else: shutil.copy2(s, d)
print("built dist/")
