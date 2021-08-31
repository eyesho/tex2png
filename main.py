import json
import cv2
import shutil
import numpy
import numpy as np
import glob
import cv2
import imageio
import subprocess
from augment import distort, stretch, perspective
import os
from sklearn.model_selection import  train_test_split
# from scikit_learn
root = "/home/ubuntu/Pictures/data_print"
train_dst_dir = "/home/ubuntu/Pictures/data_print/train_data"
if not os.path.exists(train_dst_dir):
    os.makedirs(train_dst_dir)
val_dst_dir = "/home/ubuntu/Pictures/data_print/val_data"
if not os.path.exists(val_dst_dir):
    os.makedirs(val_dst_dir)
# import cairosvg
# cairosvg.svg2png()
file_in = '/home/ubuntu/Pictures/data_print/train.norm.lst'
file_out_train = '/home/ubuntu/Pictures/data_print/train.norm.txt'
file_out_test = '/home/ubuntu/Pictures/data_print/val.norm.txt'


def list_to_img(list, image_path, output_json_name):
    with open(output_json_name, 'w') as f_train:
        f_train_to_write = []
        for idx, item in enumerate(list):
            item = item.replace('\n', '')
            png_path = image_path+'/' + str(idx) + '.png'
            svg_path = image_path+'/' + str(idx) + '.svg'
            tmp_path = image_path+'/' + str(idx) + '.tmp'
            j_dict = {"ImageFile": png_path, "Label": item.replace('\n','')}
            f_train_to_write.append(j_dict)
            if os.path.exists(png_path):
                continue
            with open(tmp_path, 'w') as tmp:
                tmp.write(item)

            cmd = "cat {}|/home/ubuntu/node/bin/node /home/ubuntu/WebstormProjects/katex-regulator/mathjax_test.js > {}".format(tmp_path,svg_path)
            cmd = cmd + "&&"
            cmd = cmd + "cairosvg -d 100 -s 2 {} -o {}".format(svg_path, png_path)
            
            cmd = cmd + "&&"
            cmd = cmd + "python print_apng_to_png.py {}".format(png_path)
            
            cmd = cmd + "&&"
            cmd = cmd + "rm {} {}".format(svg_path, tmp_path)
            
            print(item)
            print("____________________________")
            print(png_path)
            subprocess.call(cmd, shell=True)
            
        for dic in f_train_to_write:
            f_train.write(json.dumps(dic, ensure_ascii=False))
            f_train.write('\n')


if __name__ == '__main__':

    with open(file_in, 'r', encoding='utf-8') as f:
        all_list = []
        for idx, i in enumerate(f.readlines()):
            i = i.strip('\n')
            if len(i) < 1:
                continue
            all_list.append(i)
        train, test = train_test_split(all_list, test_size=0.0001, random_state=42)

        # list_to_img(list=train, image_path=train_dst_dir, output_json_name=file_out_train)
        list_to_img(list=test, image_path=val_dst_dir, output_json_name=file_out_test)
