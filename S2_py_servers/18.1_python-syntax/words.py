def print_upper_words(words, must_start_with={}):
    """Takes list of words and prints them in uppercase
        if the second argument is passed, it will only 
        print the words that start with the strings in it"""

    for word in words:
        if must_start_with:
            for str in must_start_with:
                if word.startswith(str):
                    print(word.upper())
        else:
            print(word.upper())


print_upper_words(["wow", "ahmazin", "no way", "crazy"])
# this should print "HELLO", "HEY", "YO", and "YES"
print_upper_words(["hello", "hey", "goodbye", "yo", "yes"],
                  must_start_with={"h", "y", "ge"})
