def biggestValue(list):
    wpmList = []
    for l in list:
        wpmList.append(l.wpm)
    return max(wpmList)
