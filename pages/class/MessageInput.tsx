import React from 'react';
import Image from 'next/image';
import sendIcon from 'icons/send.svg';

export function MessageInput({ forbidden }: { forbidden: boolean }) {
    return (
      <div className="fixed-bottom">
        <form>
          <div className="input-group">
            <input
              className="form-control bg-dark text-light"
              placeholder="Enter any message you like"
              disabled={forbidden}
            ></input>
            <button type="submit" className="btn btn-primary">
              <Image alt={'Send Icon'} src={sendIcon} width={24} height={24} />
            </button>
          </div>
        </form>
      </div>
    );
  }